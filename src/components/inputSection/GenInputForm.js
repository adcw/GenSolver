import React from 'react'
import GenInput from './GenInput'

const Inputs = () => {
    return (
        <div className="mycard bg-second shadowed">
            <h3 className="pb-2">Dane wejściowe</h3>
            <form action="" className="form row">
                <GenInput name="A"/>
                <GenInput name="B"/>
            </form>
        </div>
    )
}


// const inputStyle =
// {
//     back
// }

export default Inputs