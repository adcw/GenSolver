import React from 'react'
import { useState } from 'react'
import RuleGroup from './RuleGroup'
import RuleType from './RuleType'

const RuleSection = () => {

    const [genderAllels, setGenderAllels] = useState(
        [
            {
                id: 1,
                ruleType: RuleType.GENDER_ALLELS,
                allels:
                [
                    {
                        id: 1,
                        value: "X",
                        gender_determistic: false
                    },

                    {
                        id: 2,
                        value: "Y",
                        gender_determistic: true
                    }
                    
                ]
            },

            {
                id: 2,
                ruleType: RuleType.GENDER_ALLELS,
                allels:
                [
                    {
                        id: 1,
                        value: "Z",
                        gender_determistic: false
                    },

                    {
                        id: 2,
                        value: "W",
                        gender_determistic: true
                    }
                    
                ]
            }
        ]
    );

    return (
        <div className="mycard bg-second shadowed mt-3">
            <h3 className="pb-2">Reguły</h3>
            <RuleGroup ruleName="Chromosomy płci" rules={genderAllels}/>
            {/* <RuleGroup ruleName="Geny sprzężone"/> */}
        </div>
    )
}

export default RuleSection
