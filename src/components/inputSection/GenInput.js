import React from 'react'
import { useState } from 'react'

const GenInput = ({ name }) => {

    const [text, setText] = useState("")

    const visualize = (e) => {
        setText(e.target.value)
    }

    return (
        <div className="form-group mb-2 col-md-6">
            <label htmlFor="input-a">Genotyp osobnika {name}:</label>
            <input 
                type="text" 
                id="input-a" 
                className="form-control mt-1" 
                placeholder="np. AaBb"
                onChange={visualize}/>
            <h3 className="gen-input-visualise">{text}</h3>
        </div>
    )
}

export default GenInput
