import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useRef } from 'react';
import { useState } from 'react';
import { Table, Popover, OverlayTrigger, Form, FormLabel } from 'react-bootstrap';
import GenSymbol from './GenSymbol';
import './GenItem.css';
import '../../App.css';
import { ACTION } from '../../App.js'

const GenItem = ({ gene, keyId, dispatch}) => {

	const [isOverlayShown, setOverlayShown] = useState(false);
	const nameInput = useRef(null);

	const togggleActive = () => dispatch({ type: ACTION.TOGGLE_ACTIVE, payload: { id: gene.id } })

	const deleteGene = () => dispatch({ type: ACTION.DELETE_GENE, payload: { id: gene.id }});

	const saveSettings = () => {
		dispatch({ type: ACTION.SAVE_SETTINGS, payload: { id: gene.id, name: nameInput.current.value }});
		setOverlayShown(false);
	}

	const popover = (
		<Popover id="popover-basic" className="shadowed genItem-popover">
			<Popover.Header as="h3" className="bg-second">
				Edytuj gen
				<FontAwesomeIcon icon="times" className="f-right dismiss-btn mt-1" onClick={() => setOverlayShown(false)}></FontAwesomeIcon>

				<button className="btn btn-xs my-btn-dark txt-bright f-right mr-2" onClick={ saveSettings }>
					Zapisz
				</button>

			</Popover.Header>

			<Popover.Body className="bg-first txt-bright">

				<Form>
					<Form.Group>
						<FormLabel className="txt-h6" htmlFor="gen-name-input">Nazwa:</FormLabel>
						<Form.Control ref={ nameInput } type="text" id="gen-name-input" defaultValue={ gene.name }></Form.Control>
					</Form.Group>
					<hr />

					<div>
						<GenSymbol />
					</div>

				</Form>

			</Popover.Body>
		</Popover>
	);

	return (
		<Table className="genItem">
			<tbody>
				<tr className="my-gen-item mt-1">
					<td>
						<p className="m-0">{ keyId }</p>
					</td>

					<td colSpan={2}>
						<p className="m-0">{ gene.name }</p>
					</td>

					<td>
						<p className="m-0 txt-blue txt-center fill-empty">
							{
								gene.allels.lenght === 0 ? <p className="feedback">brak alleli</p> :
								gene.allels.map((allel, index) => {
									return allel + ", ";
								})
							}
						</p>
					</td>

					<td>
						<div className="f-right">

							<OverlayTrigger rootClose trigger="click" placement="bottom" overlay={popover} show={isOverlayShown}>
								<button className="btn btn-sm btn-edit">
									<FontAwesomeIcon icon="pencil-alt" onClick={() => setOverlayShown(true)}></FontAwesomeIcon>
								</button>
							</OverlayTrigger>

							<input 
								type="checkbox" 
								className="form-check-input check-input" 
								checked={ gene.isActive }
								onChange={ togggleActive }></input>

							<button 
								className="btn btn-sm btn-delete"
								onClick={ deleteGene }
								><FontAwesomeIcon icon="times" /></button>
						</div>
					</td>
				</tr>

			</tbody>
		</Table>

	)
}

export default GenItem
