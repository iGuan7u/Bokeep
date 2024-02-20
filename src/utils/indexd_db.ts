import CostRecord from "../model/record";

async function openIndexedDB(databaseName: string, version = 2): Promise<IDBDatabase> {
  return new Promise(function (resolve, reject) {
    const request = window.indexedDB.open(databaseName, version);
    request.onerror = function (event) {
      console.error('open indexedDB error', event);
      reject(event);
    };
    request.onsuccess = function (event) {
      console.log('open indexedDB success');
      resolve(request.result);
    };
    request.onupgradeneeded = function (event: IDBVersionChangeEvent) {
      const db = (event.target as IDBOpenDBRequest).result;
      var objectStore: IDBObjectStore;
      if (!db.objectStoreNames.contains('cost_record')) {
        objectStore = db.createObjectStore('cost_record', { keyPath: 'id' });
        objectStore.createIndex('spendTime', 'spendTime', { unique: false });
        objectStore.createIndex('creator', 'creator', { unique: false });
      }
      if (event.newVersion == 2 && event.oldVersion == 1) {
        console.log(`update database from ${event.oldVersion} to ${event.newVersion}`);
        const objectStore = (event.target as IDBOpenDBRequest).transaction.objectStore('cost_record');
        objectStore.createIndex('spendTime', 'spendTime', { unique: false });
        objectStore.deleteIndex('createTime');
      }
    };
  });
}

async function addRecord(record: CostRecord, databse: IDBDatabase): Promise<void> {
  return new Promise(function (resolve, reject) {
    var request = databse.transaction(['cost_record'], 'readwrite')
      .objectStore('cost_record')
      .add(record);

    request.onsuccess = function (event) {
      resolve();
    };

    request.onerror = function (event) {
      console.log('数据写入失败');
      reject(event);
    };
  });
}

async function readAllRecords(databse: IDBDatabase): Promise<Array<CostRecord>> {
  const objectStore = databse.transaction('cost_record').objectStore('cost_record');

  const records = new Array<CostRecord>();
  return new Promise(function (resolve, reject) {
    var cursor = objectStore.index("spendTime").openCursor(null, "prev");
    cursor.onsuccess = function (event) {
      const result = cursor.result;
      if (result != null) {
        records.push(CostRecord.parse(result.value));
        result.continue();
      } else {
        resolve(records);
      }
    };
    cursor.onerror = function(event) {
      reject(event);
    };
  });
}

async function deleteRecord(record: CostRecord, database: IDBDatabase) {
  const objectStore = database.transaction('cost_record', 'readwrite').objectStore('cost_record');
  const request = objectStore.delete(record.id);
  return new Promise<void>((resolve, reject) => {
    request.onsuccess = function(event) {
      resolve();
    };
    request.onerror = function (event) {
      reject(event);
    }
  });
}

async function updateRecord(record: CostRecord, database: IDBDatabase) {
  const objectStore = database.transaction('cost_record', 'readwrite').objectStore('cost_record');
  const request = objectStore.put(record);
  return new Promise<void>((resolve, reject) => {
    request.onsuccess = function(event) {
      resolve();
    };
    request.onerror = function (event) {
      console.error('put object error', event);
      reject(event);
    }
  });
}

export {
  openIndexedDB,
  addRecord,
  readAllRecords,
  deleteRecord,
  updateRecord,
}