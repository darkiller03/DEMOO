/* eslint-disable prettier/prettier */
/* eslint-disable react/react-in-jsx-scope */
import {
  Container,
  Typography,
  Box,
  Button,
  Grid,
  Card,
  CardContent,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';


const Home = () => {
  return (
    <Container maxWidth="lg">
      {/* Hero Section */}
      <Box
        sx={{
          height: '100vh',
          display: 'flex',
          margin:'30px', 
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(to right, #667eea, #764ba2)',
          color: '#fff',
          textAlign: 'center',
        }}
      >
        <Box>
          <Typography variant="h2" sx={{ fontWeight: 'bold' }}>
            Secure Your Code <br></br>with Our Team.
          </Typography>
          <Typography variant="h6" sx={{ marginTop: '1rem', opacity: 0.8 }}>
            AI-driven security analysis <br></br>to keep your application safe from vulnerabilities.
          </Typography>
          <Button
            variant="contained"
            color="secondary"
            size="large"
            sx={{ marginTop: '2rem', borderRadius: '50px', padding: '0.8rem 2rem' }}
          >
            Get Started
          </Button>
        </Box>
      </Box>

      {/* Purpose Section */}
      <Box sx={{ 
          padding: '4rem 0', 
          textAlign: 'center', 
          border: '7px solid #212631', 
          maxWidth: '800px', 
          margin: 'auto', 
          borderRadius: '8px' 
      }}>
        <Typography variant="h4" gutterBottom>
          Why This Platform?
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: '700px', margin: 'auto' }}>
          Our platform is designed to help developers secure their code, by leveraging AI to detect vulnerabilities and
          adhering to the best coding practices, including the OWASP Top 10 guidelines.
        </Typography>
      </Box>


      {/* Pricing Plans */}
      <Box sx={{ padding: '4rem 0', backgroundColor: '#f4f5f7', textAlign: 'center' }}>
      <Typography 
        variant="h4" 
        gutterBottom 
        sx={{ 
          textDecoration: 'underline', 
          textDecorationColor: '#212631' // Sets the underline color
        }}
      >
        Pricing Plans
      </Typography>

        <Grid container spacing={3} sx={{ marginTop: '2rem' }}>
          {[
            {
              title: 'Free Plan',
              price: '$0 / month',
              features: ['Basic vulnerability analysis', 'OWASP top 10 scanning', 'Email support'],
            },
            {
              title: 'Pro Plan',
              price: '$29 / month',
              features: ['Advanced analysis', 'Priority support', 'CI/CD integration'],
            },
            {
              title: 'Enterprise Plan',
              price: 'Custom pricing',
              features: ['Full audit', '24/7 support', 'Dedicated advisor'],
            },
          ].map((plan, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card
                sx={{
                  borderRadius: '15px',
                  boxShadow: '0px 6px 20px rgba(0, 0, 0, 0.1)',
                  padding: '2rem',
                  textAlign: 'center',
                  backgroundColor: '#fff',
                }}
              >
                <CardContent>
                  <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                    {plan.title}
                  </Typography>
                  <Typography variant="h6" sx={{ marginTop: '1rem', color: '#667eea' }}>
                    {plan.price}
                  </Typography>
                  {plan.features.map((feature, i) => (
                    <Typography key={i} variant="body2" sx={{ marginTop: '0.5rem' }}>
                      {feature}
                    </Typography>
                  ))}
                  <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    sx={{ marginTop: '2rem', borderRadius: '50px' }}
                  >
                    {index === 2 ? 'Contact Us' : 'Get Started'}
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

    </Container>
  );
};

export default Home;
