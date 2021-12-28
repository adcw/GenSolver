import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useRef, useEffect, useState } from 'react';
import { Popover, OverlayTrigger, Form, FormLabel, Collapse } from 'react-bootstrap';
import AllelSymbol from './AllelSymbol';
import './GenItem.css';
import '../../App.css';
import '../../utils/events/EventEmitter.js'
import { ACTION } from '../../App.js';
import Confirm from '../general/Confirm';
import AllelEditor from './AllelEditor';
import SubSup from './SubSup';
import { GTContent } from '../genotypetemplate/elements/GTContent';
import { newAllel } from '../../AppContextProvider';
import EventEmitter, { E } from '../../utils/events/EventEmitter.js';

const GenItem = ({ gene, keyId, dispatch }) => {

	const [firstTime, setFirstTime] = useState(true);
	const nameInput = useRef(null);
	const editBtn = useRef(null);
	const allelCount = useRef(Object.keys(gene.allels).length);

	/*
	DISPATCH FUNCTIONS
	*/
	const D_togggleActive = () => dispatch({ type: ACTION.TOGGLE_ACTIVE, payload: { id: gene.id } });
	const D_deleteGene = () => 	dispatch({ type: ACTION.REMOVE_GENE, payload: { id: gene.id } });
	const D_saveModifiedName = (_newName) => dispatch({ type: ACTION.SAVE_GENE_NAME, payload: { id: gene.id, name: _newName } });
	const D_saveModifiedAllel = (modifiedAllelIndex, newAllel) => dispatch({ type: ACTION.MODIFY_ALLEL, payload: { id: gene.id, modifiedAllelIndex, newAllel } });
	const D_addNewAllel = () => {
		if (allelCount.current < 7) {
			dispatch({ type: ACTION.ADD_ALLEL, payload: { id: gene.id } });
			allelCount.current++;
		}
	}

	const D_removeAllel = (allelIndex) => dispatch({ type: ACTION.REMOVE_ALLEL, payload: { id: gene.id, modifiedAllelIndex: 0 } });
	const D_setGeneAllels = (allels) => dispatch({ type: ACTION.SET_GENE_ALLELS, payload: { id:gene.id, allels: allels } });
	//
	const [isSaveButtonActive, setIsSaveButtonActive] = useState(false);

	const nameInputRef = useRef(null);
	const [tempGeneContent, setTempGeneContent] = useState({ ...gene });

	const deleteAllel = (_allelId) => {
		setTempGeneContent({
			...tempGeneContent,
			allels: tempGeneContent.allels.filter((v, k) => {
				return k !== _allelId
			})
		});
	};

	const addAllel = () => {
		setTempGeneContent({
			...tempGeneContent,
			allels: [...tempGeneContent.allels, newAllel()]
		});
	}

	const saveModifiedAllel = (_modifiedAllelIndex, _newAllel) => {
		setTempGeneContent({
			...tempGeneContent,
			allels: [...tempGeneContent.allels.map((allel, k) => {
				return k === _modifiedAllelIndex ?
				_newAllel :
				allel
			})]
		});
		console.log(JSON.stringify(tempGeneContent));
	}

	const toggleActive = () => {
		setTempGeneContent({
			...tempGeneContent,
			isActive: !tempGeneContent.isActive
		})
		D_togggleActive();
	}

	const discardChanges = () => {
		if (nameChanged()) nameInputRef.current.value = gene.name;
		if (allelsChanged()) setTempGeneContent({ ...gene });
		onAnyChange();
	};

	const saveChanges = () => {
		if (nameChanged()) D_saveModifiedName(nameInputRef.current.value);
		if (allelsChanged()) D_setGeneAllels(tempGeneContent);
	};

	const nameChanged = () => nameInputRef !== null ? nameInputRef.current.value !== gene.name : false;
	const allelsChanged = () => JSON.stringify(tempGeneContent) !== JSON.stringify(gene)
	const onAnyChange = () => setIsSaveButtonActive(nameChanged() || allelsChanged());

	useEffect(() => {
		onAnyChange();

		const restDefSubscription = EventEmitter.addListener(E.onRestoreDefault, () => {
			console.log("Restored default state");
			discardChanges();
		});

		return () => {
			restDefSubscription.remove();
		}
	});

	const [chosenAllelIndex, setChosenAllelIndex] = useState(null);
	const [collapseOpen, setCollapseOpen] = useState(false);

	const popover = (
		<Popover id="popover-basic" className="shadowed genItem-popover bg-first">
			<Popover.Header as="h6" className="bg-second">
				<p className="mb-0 text-sm d-inline">Edytuj allel</p>
				<FontAwesomeIcon icon="times" className="f-right dismiss-btn mt-1 text-sm" onClick={() => document.body.click()}></FontAwesomeIcon>

			</Popover.Header>

			<Popover.Body className="bg-first txt-bright popover-body">

				{/* <Form>
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

					</div> */}

				<AllelEditor
					chosenAllel={tempGeneContent.allels[chosenAllelIndex]}
					chosenAllelIndex={chosenAllelIndex}
					removeAllel={D_removeAllel}
					geneId={keyId}
					saveModifiedAllel={saveModifiedAllel}
				/>

				{/* </Form> */}

			</Popover.Body>
		</Popover>
	);

	return (
		<>
			<tr className="template-header mt-1">
				<td className='m-0 p-1'>
					<p className="m-0 text-sm">{keyId}</p>
				</td>

				<td colSpan={2} className='m-0 p-1'>
					<p className="m-0 text-sm">{gene.name}</p>
				</td>

				<td className='m-0 p-1'>

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
						{/* <OverlayTrigger rootClose trigger="click" placement="bottom" overlay={popover} > */}
						<button className="btn btn-sm btn-edit" ref={editBtn}
							onClick={() => setCollapseOpen(!collapseOpen)}
						>
							<FontAwesomeIcon icon="pencil-alt" ></FontAwesomeIcon>
						</button>
						{/* </OverlayTrigger> */}

						{/* Wyłączanie i włączanie genu */}
						<input
							type="checkbox"
							className="form-check-input check-input"
							defaultChecked={gene.isActive}
							onChange={toggleActive}
						/>

						{/* Usuwanie genu */}
						<Confirm
							content={<center className="mb-3">Czy na pewno chcesz usunąć bezpowrotnie wybrany gen?</center>}
							onConfirm={D_deleteGene}
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

			<tr className="p-1">
				<td colSpan="12" className='w-100 py-0 template-content'>
					<Collapse in={collapseOpen}>
						<div className='pb-3'>

							<GTContent title="Nazwa:">
								<input type="text"
									ref={nameInputRef}
									className="w-100 btn-xs"
									defaultValue={gene.name}
									onChange={() => onAnyChange()}
									>
								</input>

								<button className="btn-xs btn my-btn-warning mx-1" disabled={!isSaveButtonActive}
									onClick={() => discardChanges()}
								>
									Anuluj
								</button>

								<button className="btn-xs btn my-btn-success"
									disabled={!isSaveButtonActive}
									onClick={saveChanges}
								>
									Zapisz
								</button>
							</GTContent>

							<hr className="m-2"></hr>

							<GTContent title="Allele:">
								<div className='genelist'>
									<button
										onClick={ ()=> addAllel() }
									>Dodaj test</button>
									{
										tempGeneContent.allels.map((allel, k) => {
											return (
												<span key={k} className="tmp-gene-list-item d-flex">

													<OverlayTrigger rootClose trigger="click" placement="right" overlay={popover}>
														<div className="genSymbol"
															onClick={() => setChosenAllelIndex(k)}
															>
															<p>
																<SubSup allel={allel} small={true} />
															</p>
														</div>
													</OverlayTrigger>

													<input className="btn-xs w-100" placeholder="podaj etykietę allelu"></input>

													<p className="text-sm m-0 pl-3 pr-2">Priorytet:</p>
													<input className="priority-input" type="number" min="0" defaultValue="0"></input>
													<FontAwesomeIcon icon="times" className="f-right dismiss-btn mt-2 text-sm mx-2 pointer"
														onClick={ () => deleteAllel(k) }
													></FontAwesomeIcon>
												</span>
											)

										})
									}
								</div>
							</GTContent>

						</div>
					</Collapse>
				</td>
			</tr>

		</>

	)
}

GenItem.defaultProps = {
	isNew: false
}

export default GenItem
