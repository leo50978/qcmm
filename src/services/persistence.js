import { questionnaireVersion } from "../config/app-config.js";

const localKey = uid => `pet-sitting-questionnaire:${uid}`;
const localTtlMs = 7 * 24 * 60 * 60 * 1000;
export function readLocal(uid) {
  try {
    const key=localKey(uid),data=JSON.parse(localStorage.getItem(key)||"null");
    if(!data)return null;
    const updated=Date.parse(data.updatedAt||"");
    if(!Number.isFinite(updated)||Date.now()-updated>localTtlMs){localStorage.removeItem(key);return null;}
    return data;
  } catch { return null; }
}
export function writeLocal(uid, answers, status="draft") {
  try { localStorage.setItem(localKey(uid), JSON.stringify({ questionnaireVersion, status, answers, updatedAt:new Date().toISOString() })); return true; }
  catch { return false; }
}
export function clearLocal(uid) {
  try { localStorage.removeItem(localKey(uid)); } catch { /* Local storage may be disabled by the browser. */ }
}
