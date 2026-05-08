const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const assert = require('assert');
const exp = require('constants');

function runScript(db, script) {
  const sql = fs.readFileSync(script, 'utf8');
  return new Promise((resolve, reject) => {
    db.all(sql, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

const getExpectedRecord = (db, expectedRecord) => {
  const sql = `SELECT * FROM Stores WHERE ID=${expectedRecord.ID} AND LOCATION='${expectedRecord.LOCATION}' AND EMPLOYEE_ID=${expectedRecord.EMPLOYEE_ID} AND REVENUE=${expectedRecord.REVENUE};`;
  return new Promise((resolve, reject) => {
    db.all(sql, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

describe('the SQL in the `exercise.sql` file', () => {
  let db;
  let scriptPath;
  let cleanup

  beforeAll( async () => {
    const dbPath = path.resolve(__dirname, '..', 'lesson22.db');
    db = new sqlite3.Database(dbPath);
    scriptPath = path.resolve(__dirname, '..', 'exercise.sql');
    cleanup = path.resolve(__dirname, './cleanup.sql')
    await runScript(db, cleanup);
  });

  afterAll( async () => {
    await runScript(db, cleanup);
    db.close();
  });

  test('Should insert a new record into the Stores table where ID, LOCATION, EMPLOYEE_ID, and REVENUE have the correct values', async () => {
    await runScript(db, scriptPath);
    let expectedRecord = {
      ID: 57,
      LOCATION: 'Lexington',
      EMPLOYEE_ID: 1015,
      REVENUE: 3595
    };

    const record = await getExpectedRecord(db, expectedRecord);
    expect(record[0]).toEqual(expectedRecord);
    });
  });


