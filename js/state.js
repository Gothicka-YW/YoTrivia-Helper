export const CATEGORIES=['YoWorld & BVG','Movies & Shows','Animals & Nature','Music & Pop Culture','General Knowledge','Fantasy & Fiction'];
export const DEFAULTS={qPer:25,lockOnAward:true,colorMap:{yellow:'General Knowledge',blue:'Music & Pop Culture',orange:'Movies & Shows',red:'YoWorld & BVG',purple:'Fantasy & Fiction',green:'Animals & Nature'}};
export async function load(){return await chrome.storage.local.get({settings:DEFAULTS,roster:[],session:null});}
export async function save(p){await chrome.storage.local.set(p);}
export const uid=(p='id')=>p+'_'+Math.random().toString(36).slice(2,9);
export function newSession(category,qPer){return {id:uid('sess'),category,qPer,index:-1,asked:[],locked:false,current:null};}