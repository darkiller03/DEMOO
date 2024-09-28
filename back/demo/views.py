import json
import requests
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import File, Vulnerability
from .serializers import VulnerabilitySerializer

URL = ""
HEADERS = {
    "Content": "application/json",
    "api-key": "",
}


@csrf_exempt
def analyze_code(request):
    print('marhbe ena executed')
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            file_content = data.get('code')
            if not file_content:
                return JsonResponse({"error": "No code provided"}, status=400)

            file_name = data.get('FileName') # You can set a default file name or get it from the request if available
            
            if File.objects.filter(filename=file_name).exists():
                return JsonResponse({"error": "File with the same name already exists"}, status=409) 
            
            print(f"Uploaded file name: {file_name}")

            payload = {
        "messages": [
            {
                "role": "system",
                "content": "You are a professional hacker that works on the source code to detect security code best practices, vulnerabilities and security functions in the code",
            },
            {
                "role": "user",
                "content": """Analyze the provided code for security vulnerabilities. For each identified vulnerability, provide the following information in JSON format:

                Vulnerability: The name of the vulnerability.
                Description: A comprehensive description of the vulnerability, including how it can be exploited and its potential impact on the system.
                Priority: The priority level of addressing this vulnerability (e.g., High, Medium, Low), based on factors such as exploitability and potential damage.
                Risk: The risk level of the vulnerability (e.g., Critical, High, Medium, Low), indicating the severity and likelihood of exploitation.
                Status: The current status of the vulnerability (e.g., Open, Closed, Resolved). If security measures are implemented to address the vulnerability, set the status to "Resolved".
                CWE: The Common Weakness Enumeration identifier for the vulnerability, providing a reference to a specific category of weaknesses.
                Recommendation: How to mitigate the vulnerability briefly.
                Implemented Security Measures: The security code configuration or functions already implemented (e.g., parameterized queries for SQL, CSRF tokens, secure cookie flags, input validation, output encoding).

                In addition to identifying vulnerabilities, provide a detailed analysis of the existing security measures in the code. If any security measures are already in place and fully mitigate the vulnerability, mark the status as "Resolved" and describe the security measures detected. If the security measures are insufficient, include the vulnerability and explain how it can be bypassed and what additional measures should be implemented to fully address it.
                """,
            },
            {"role": "user", "content": file_content},
        ],
        "temperature": 0.5,
        "top_p": 0.9,
    }

            response = requests.post(URL, headers=HEADERS, data=json.dumps(payload))
            if response.status_code == 404:
                return JsonResponse({"error": "External API resource not found"}, status=404)
            result = response.json()
            if "choices" in result and len(result["choices"]) > 0:
                message = result["choices"][0]["message"]["content"]
                try:
                    json_start = message.find("```json")
                    json_end = message.find("```", json_start + 7)

                    if json_start != -1 and json_end != -1:
                        json_content = message[json_start + 7:json_end].strip()
                        vulnerabilities_data = json.loads(json_content)
                        
                        file_instance = File.objects.create(
                            filename=file_name,
                            filecontent=file_content
                        )
                        
                        # Create the Vulnerability instances
                        for vuln_data in vulnerabilities_data:
                            Vulnerability.objects.create(
                                file=file_instance,  # Associate vulnerability with the file
                                vulnerability=vuln_data.get("Vulnerability"),
                                status=vuln_data.get("Status"),
                                risk=vuln_data.get("Risk"),
                                recommendation=vuln_data.get("Recommendation"),
                                implemented_measures=vuln_data.get("Implemented Security Measures"),
                                description=vuln_data.get("Description"),
                                priority=vuln_data.get("Priority"),
                                cwe=vuln_data.get("CWE")
                            )

                        return JsonResponse({"Vulnerabilities": vulnerabilities_data}, status=200)
                    else:
                        return JsonResponse({"error": "JSON content not found in the response"}, status=500)

                except json.JSONDecodeError:
                    return JsonResponse({"error": "Error decoding JSON response"}, status=500)
            else:
                return JsonResponse({"error": "No vulnerabilities detected or response format is unexpected"}, status=500)
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON data"}, status=400)
    else:
        return JsonResponse({"error": "Invalid request method"}, status=405)
    

@api_view(['PATCH'])
def update_vulnerability_status(request, vulnerabilityId):
    try:
        # Retrieve the vulnerability by ID from the URL
        vulnerability = Vulnerability.objects.get(id=vulnerabilityId)
        print("Vulnerability found:", vulnerability)
        
    except Vulnerability.DoesNotExist:
        return Response({'error': 'Vulnerability not found'}, status=status.HTTP_404_NOT_FOUND)

    # Get the new status from the request data
    new_status = request.data.get('status')

    if new_status:
        # Update the status and save
        vulnerability.status = new_status
        vulnerability.save()
        return Response({'success': 'Status updated successfully'}, status=status.HTTP_200_OK)
    else:
        return Response({'error': 'Invalid status'}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def get_vulnerabilities_by_filename(request, fileName):
    try:
        # Print the filename for debugging purposes
        print("This is the file name:", fileName)
        
        # Find the file by name
        file = File.objects.filter(filename=fileName).first()  # Ensure 'name' is the correct field
        
        # If the file does not exist, return a 404 error
        if file is None:
            return Response({'error': 'File not found'}, status=status.HTTP_404_NOT_FOUND)
        
        # Print the file ID for debugging purposes
        print("This is the file ID:", file.id)
        
        # Retrieve vulnerabilities associated with the file ID
        vulnerabilities = Vulnerability.objects.filter(file=file.id)
        
        # Print the found vulnerabilities for debugging purposes
        print("This is the found vulnerabilities:", vulnerabilities)
        
        # If no vulnerabilities are found, return a 404 error
        if not vulnerabilities.exists():
            return Response({'error': 'No vulnerabilities found for the specified file'}, status=status.HTTP_404_NOT_FOUND)
        
        # Serialize the vulnerabilities
        serializer = VulnerabilitySerializer(vulnerabilities, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)