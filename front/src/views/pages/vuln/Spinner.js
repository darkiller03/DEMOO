/* eslint-disable prettier/prettier */
/* eslint-disable react/react-in-jsx-scope */
import { useState } from 'react'
import ClipLoader from 'react-spinners/ClipLoader'

const override = {
  display: 'block',
  margin: '0 auto',
}

function App() {
  const [loading, setLoading] = useState(true)
  const [color, setColor] = useState('#3250d7')

  return (
    <div className="sweet-loading">
      {/* Uncomment to allow toggling the loader */}
      {/* <button onClick={() => setLoading(!loading)}>Toggle Loader</button> */}
      {/* <input
        value={color}
        onChange={(input) => setColor(input.target.value)}
        placeholder="Color of the loader"
        style={{ marginBottom: '10px', padding: '5px' }}
      /> */}

      <ClipLoader
        color={color}
        loading={loading}
        cssOverride={override}
        size={100}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
    </div>
  )
}

export default App
