import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useRef, useEffect, useState } from 'react';
import { Table, Popover, OverlayTrigger, Form, FormLabel } from 'react-bootstrap';
import GenSymbol from './GenSymbol';
import './GenItem.css';
import '../../App.css';
import { ACTION } from '../../App.js';
import Confirm from '../general/Confirm';
import AllelEditor from './AllelEditor';

const GenItem = ({ gene, keyId, dispatch }) => {

	const [newName, setnewName] = useState(gene.name);
	const [firstTime, setFirstTime] = useState(true);

	const nameInput = useRef(null);
	const editBtn = useRef(null);
	const deleteBtn = useRef(null);

	const togggleActive = () => dispatch({ type: ACTION.TOGGLE_ACTIVE, payload: { id: gene.id } })

	const deleteGene = () => dispatch({ type: ACTION.DELETE_GENE, payload: { id: gene.id }});

	const saveSettings = () => {
		dispatch({ type: ACTION.SAVE_SETTINGS, payload: { id: gene.id, name: nameInput.current.value }});
		document.body.click();
	}

	const isChanged = () => {
		return newName !== gene.name
	}

	useEffect(() => {
		if (gene?.triggerEdit && firstTime) {
			console.log("it is new gene");
			editBtn.current.click();
			setFirstTime(false);
		}
			
		return () => {
			// cleanup
		}
	}, [gene.triggerEdit, firstTime])

	const [chosenAllel, setChosenAllel] = useState(null);

	const popover = (
		<Popover id="popover-basic" className="shadowed genItem-popover">
			<Popover.Header as="h3" className="bg-second">
				Edytuj gen
				<FontAwesomeIcon icon="times" className="f-right dismiss-btn mt-1" onClick={() => document.body.click()}></FontAwesomeIcon>

				<button 
					className="btn btn-xs my-btn-dark txt-bright f-right mr-2" 
					onClick={ saveSettings }
					disabled={ !isChanged() }>
					Zapisz
				</button>

			</Popover.Header>

			<Popover.Body className="bg-first txt-bright">

				<Form>
					<Form.Group>
						<FormLabel className="txt-h6" htmlFor="gen-name-input">Nazwa:</FormLabel>
						<Form.Control 
							ref={ nameInput } 
							type="text" 
							id="gen-name-input" 
							defaultValue={ gene.name }
							onChange={ e => setnewName(e.target.value) }>

							</Form.Control>
					</Form.Group>
					<hr/>

					<div>
						{
							gene.allels.map((allel, key) => {
								return <GenSymbol content={ allel } key={ key } 
								onClick={ () => setChosenAllel(allel) }/>
							})
						}
						<GenSymbol isAddButton/>
					</div>
					
					<AllelEditor chosenAllel={ chosenAllel } setChosenAllel={ setChosenAllel }/>

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

						<div className="f-right d-flex">

							<p className="m-0 txt-blue txt-right fill-empty">
								{
									gene.allels[0] === undefined && <p>-</p>
								}
								{
									gene.allels.map((allel, index) => {
										return allel + ", ";
									})
								}
							</p>

							<OverlayTrigger rootClose trigger="click" placement="bottom" overlay={popover} >
								<button className="btn btn-sm btn-edit" ref={ editBtn }>
									<FontAwesomeIcon icon="pencil-alt" ></FontAwesomeIcon>
								</button>
							</OverlayTrigger>

							<input 
								type="checkbox" 
								className="form-check-input check-input" 
								checked={ gene.isActive }
								onChange={ togggleActive }
							/>

							<Confirm
								content={ <center className="mb-3">Czy na pewno chcesz usunąć bezpowrotnie wybrany gen?</center> }
								onConfirm={ deleteGene }
							>
								<button 
									ref={ deleteBtn }
									id="btn-delete"
									className="btn btn-sm btn-delete"
									// onClick={ deleteGene }
									><FontAwesomeIcon icon="times" />
								</button>
							</Confirm>

						</div>
					</td>
				</tr>

			</tbody>
		</Table>

	)
}

GenItem.defaultProps = {
	isNew: false
}

export default GenItem
