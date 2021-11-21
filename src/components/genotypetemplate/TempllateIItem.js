import GenSymbol from "../genepalette/GenSymbol"
import SubSup from "../genepalette/SubSup"
import "../genotypetemplate/templateItem.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from "react";
import { Collapse } from "react-bootstrap";
import { queryByDisplayValue } from "@testing-library/dom";

export const TempllateIItem = ({template, keyId, dispatch, state}) => {

    const [collapseOpen, setCollapseOpen] = useState(false);

    return (
        <>
            <tr className="template-header">
                <td className="m-0">{keyId + 1}</td>
                <td className="m-0">{template.name}</td>

                <td className="m-0">
                    <div>
                        <div className="m-0 txt-right fill-empty d-flex">

                        {
                            template.gene_ids.map((v, k) => {

                                return (
                                    <div className="d-inline gene-card">
                                        <SubSup allel={state.default_genes[v].allels[0]}></SubSup>
                                    </div>
                                )
                            })
                        }
                        </div>
                    </div>
                </td>

                <td>
                    <button 
                        className="btn btn-sm btn-edit-bright"
                        onClick={() => setCollapseOpen(!collapseOpen)}
                        aria-controls="collapse-menu"
                        aria-expanded="false"
                    >
                        <FontAwesomeIcon icon="pencil-alt"></FontAwesomeIcon>
                    </button>
                </td>

            </tr>

            <tr className="border-4">
                <td colSpan="12" className="w-100 py-0 template-content">
                    <Collapse in={collapseOpen}>
                        <div id="collapse-menu" className="w-100">

                            <div className="w-100">
                                <p>Geny:</p>
                                <div className="genelist">
                                {
                                    template.gene_ids.map((v, k) => {

                                        return (
                                            <p>{`${k + 1}. ${state.default_genes[v].name}"`}</p>
                                        )
                                    })
                                }
                                </div>
                            </div>

                        </div>
                    </Collapse>
                </td>
            </tr>

            <tr>
                <td colSpan="12"></td>
            </tr>   

            {/* <tr>
                <td className="m-0">{JSON.stringify(template)}</td>
            </tr> */}
        </>
    )
}
