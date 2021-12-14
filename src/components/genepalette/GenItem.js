import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useRef, useEffect, useState } from 'react';
import { Popover, OverlayTrigger, Form, FormLabel } from 'react-bootstrap';
import GenSymbol from './GenSymbol';
import './GenItem.css';
import '../../App.css';
import '../../utils/events/EventEmitter.js'
import { ACTION } from '../../App.js';
import Confirm from '../general/Confirm';
import AllelEditor from './AllelEditor';
import SubSup from './SubSup';
import { E } from '../../utils/events/EventEmitter';
// import EventEmitter from '../../utils/events/EventEmitter.js';

const GenItem = ({ gene, keyId, dispatch }) => {

	const [newName, setnewName] = useState(gene.name);
	const [firstTime, setFirstTime] = useState(true);

	const nameInput = useRef(null);
	const editBtn = useRef(null);
	const allelCount = useRef(Object.keys(gene.allels).length);

	/*
	DISPATCH FUNCTIONS
	*/
	const togggleActive = () => dispatch({ type: ACTION.TOGGLE_ACTIVE, payload: { id: gene.id } })

	const deleteGene = () => {
		dispatch({ type: ACTION.REMOVE_GENE, payload: { id: gene.id } });
		// EventEmitter.emit(E.onGeneDeleted, { id: gene.id });
	}

	const saveModifiedName = () => dispatch({ type: ACTION.SAVE_GENE_NAME, payload: { id: gene.id, name: newName } });

	const saveModifiedAllel = (modifiedAllelIndex, newAllel) => {
		dispatch({ type: ACTION.MODIFY_ALLEL, payload: { id: gene.id, modifiedAllelIndex, newAllel } });
	}

	const addNewAllel = () => {
		if (allelCount.current < 7) {
			dispatch({ type: ACTION.ADD_ALLEL, payload: { id: gene.id } });
			allelCount.current++;
		}
	}

	const removeAllel = (allelIndex) => {
		console.log("Allel to be removed h: " + allelIndex);
		dispatch({ type: ACTION.REMOVE_ALLEL, payload: { id: gene.id, modifiedAllelIndex: 0 } });
	}

	const saveSettings = () => {
		saveModifiedName();
		document.body.click();
	}

	const isChanged = () => newName !== gene.name;

	const testDelete = () => {
		console.log("geneid = " + gene.id);
		dispatch({ type: ACTION.REMOVE_ALLEL, payload: { geneId: gene.id, allel: 0 } })
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

	const [chosenAllelIndex, setChosenAllelIndex] = useState(null);

	const popover = (
		<Popover id="popover-basic" className="shadowed genItem-popover">
			<Popover.Header as="h3" className="bg-second">
				Edytuj gen
				<FontAwesomeIcon icon="times" className="f-right dismiss-btn mt-1" onClick={() => document.body.click()}></FontAwesomeIcon>

				<button
					className="btn btn-xs my-btn-dark txt-bright f-right mr-2"
					onClick={saveSettings}
					disabled={!isChanged()}>
					Zapisz
				</button>

			</Popover.Header>

			<Popover.Body className="bg-first txt-bright">

				<Form>
					<Form.Group>
						<FormLabel className="txt-h6" htmlFor="gen-name-input">Nazwa:</FormLabel>
						<Form.Control
							ref={nameInput}
							type="text"
							id="gen-name-input"
							defaultValue={gene.name}
							onKeyDown={(e) => (e.key === 'Enter' && (e.preventDefault() || saveSettings()))}
							onChange={e => setnewName(e.target.value)}>
						</Form.Control>
					</Form.Group>
					<hr />

					<div className="gen-symbols">
						{
							gene.allels.map((allel, index) => {
								return <GenSymbol className={index === chosenAllelIndex ? "active" : ""} content={allel} key={index}
									onClick={() => {
										setChosenAllelIndex(index)
									}} />
							})
						}
						{
							allelCount.current < 7 &&
							<GenSymbol
								isAddButton
								onClick={addNewAllel}
							/>
						}

					</div>

					<AllelEditor
						chosenAllel={gene.allels[chosenAllelIndex]}
						chosenAllelIndex={chosenAllelIndex}
						removeAllel={removeAllel}
						geneId={keyId}
						saveModifiedAllel={saveModifiedAllel}
					/>

				</Form>

			</Popover.Body>
		</Popover>
	);

	return (
		<>
			<tr className="my-gen-item mt-1">
				<td>
					<p className="m-0">{keyId}</p>
				</td>

				<td colSpan={2}>
					<p className="m-0">{gene.name}</p>
				</td>

				<td>

					<div className="f-right d-flex p-relative">

						{/* Allele */}
						<p className="m-0 txt-blue txt-right fill-empty">
							{
								gene.allels[0] === undefined && '-'
							}
							{
								gene.allels.map((allel, index) => {
									return <span key={index}>
										<SubSup allel={allel} />
										<span>, </span>
									</span>
								})
							}
						</p>

						{/* Edycja */}
						<OverlayTrigger rootClose trigger="click" placement="bottom" overlay={popover} >
							<button className="btn btn-sm btn-edit" ref={editBtn}>
								<FontAwesomeIcon icon="pencil-alt" ></FontAwesomeIcon>
							</button>
						</OverlayTrigger>

						{/* Wyłączanie i włączanie genu */}
						<input
							type="checkbox"
							className="form-check-input check-input"
							checked={gene.isActive}
							onChange={togggleActive}
						/>

						{/* Usuwanie genu */}
						<Confirm
							content={<center className="mb-3">Czy na pewno chcesz usunąć bezpowrotnie wybrany gen?</center>}
							onConfirm={deleteGene}
						>
							<button

								id="btn-delete"
								className="btn btn-sm btn-delete"
							><FontAwesomeIcon icon="times" />
							</button>
						</Confirm>

					</div>
				</td>
			</tr>
		</>

	)
}

GenItem.defaultProps = {
	isNew: false
}

export default GenItem
