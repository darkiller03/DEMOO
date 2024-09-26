import React from 'react'
import { CCard, CCardBody, CCardHeader, CCol, CRow, CContainer } from '@coreui/react'

const Home = () => {
  return (
    <CContainer fluid>
      <CRow>
        <CCol>
          <CCard>
            <CCardHeader>
              <h1>Welcome to the Vulnerability Detection Dashboard</h1>
            </CCardHeader>
            <CCardBody>
              <h2>About OpenAI</h2>
              <p>
                OpenAI is an AI research and deployment company. Our mission is to ensure that artificial general 
                intelligence benefits all of humanity. OpenAI creates state-of-the-art machine learning models, 
                like GPT-4, which power a wide variety of applications including language processing, image generation, 
                and more.
              </p>
              <h2>Pricing Plans</h2>
              <p>
                OpenAI offers several pricing plans for its API usage based on the needs of the developers and businesses:
              </p>
              <ul>
                <li>
                  <strong>Free Plan:</strong> Includes limited access to the GPT models with certain usage caps. Ideal for 
                  individual developers and small projects.
                </li>
                <li>
                  <strong>Pay-as-you-go Plan:</strong> Allows flexible scaling based on API usage. Perfect for growing 
                  businesses that need scalable AI solutions.
                </li>
                <li>
                  <strong>Enterprise Plan:</strong> Tailored to large organizations, offering enhanced support and 
                  customization options.
                </li>
              </ul>
              <p>
                For more details about pricing, visit the OpenAI website or contact their sales team for custom solutions.
              </p>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
  )
}

export default Home
