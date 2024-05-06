import { readAllRecords, openIndexedDB } from '../utils/indexd_db';

interface ISyncResult {
  ret: number
}

interface ISyncTimeResult {
  ret: number
  maxUpdateTime: number
}

class SyncService {
  static async startSync() {
    const serverAddress = window.localStorage.getItem("SETTING_SERVER_ADDRESS");
    const serverToken = window.localStorage.getItem("SETTING_SERVER_TOKEN");
    const serverUserName = window.localStorage.getItem("SETTING_SERVER_USER_NAME");
    const serverUerId = window.localStorage.getItem("SETTING_SERVER_USER_ID");
    if (serverAddress == null || serverToken == null || serverUserName == null) {
      return;
    }
    const db = await openIndexedDB('cost_record');
    const records = await readAllRecords(db);
    // const result = await fetch(`https://${serverAddress}/records`, {
    //   method: 'PUT',
    //   headers: {
    //     'Content-Type': 'application/json'
    //   },
    //   body: JSON.stringify(records)
    // }).then(res => res.json()) as ISyncResult;
    // if (result.ret === 0) {
    //   console.log('sync success');
    // }
    const syncTimeRes = await fetch(`https://${serverAddress}/records/max?id=${serverUerId}`, {
      method: 'GET',
      headers: {
        Authorization: `Token ${serverToken}`
      }
    }).then(res => res.json()) as ISyncTimeResult;
    if (syncTimeRes.ret !== 0) {
      console.error("syncTime res error");
      return;
    }
    console.log('syncTime success');
  }
}

export default SyncService;