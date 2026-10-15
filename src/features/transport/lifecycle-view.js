import { esc } from '../../core/dom.js';
import { transportStatusLabel } from './status.js';
export function renderLifecycle(rows,lang,copy){
 if(!rows.length)return '';
 return `<section class="shipment-lifecycle"><h3>${esc(copy('shipmentProgress'))}</h3>${rows.map(row=>`<article class="shipment-stage"><div><b>${esc(row.provider_display_name||'Yoldash')}</b><span>${esc(transportStatusLabel(row.assignment_status,lang))}</span></div><div class="shipment-stage-actions">${row.can_advance===true&&row.next_status?`<button type="button" class="btn primary" data-advance-assignment="${esc(row.assignment_id)}" data-expected-stage="${esc(row.assignment_status)}" data-next-stage="${esc(row.next_status)}">${esc(copy('confirmStage'))}: ${esc(transportStatusLabel(row.next_status,lang))}</button>`:''}<button type="button" class="btn secondary" data-assignment-history="${esc(row.assignment_id)}" aria-expanded="false">${esc(copy('statusHistory'))}</button></div><div class="assignment-history" data-history-for="${esc(row.assignment_id)}" hidden></div></article>`).join('')}</section>`;
}
