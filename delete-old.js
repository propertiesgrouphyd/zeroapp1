// ======================================================
// QUANTUMFEED
// DELETE VIDEOS OLDER THAN 7 DAYS
// ======================================================

const admin =
require("firebase-admin");

const serviceAccount =
JSON.parse(
process.env.FIREBASE_SERVICE_ACCOUNT
);

// ======================================================
// INIT
// ======================================================

admin.initializeApp({

credential:
admin.credential.cert(
serviceAccount
)

});

const db =
admin.firestore();

// ======================================================
// CONFIG
// ======================================================

const SEVEN_DAYS =

7 *
24 *
60 *
60 *
1000;

const cutoff =

Date.now() -
SEVEN_DAYS;

// ======================================================
// DELETE
// ======================================================

async function cleanup(){

console.log(
"QuantumFeed Cleanup Started"
);

const snapshot =
await db
.collection("videos")
.where(
"createdAt",
"<",
cutoff
)
.get();

if(snapshot.empty){

console.log(
"No expired videos found"
);

return;
}

const batch =
db.batch();

snapshot.forEach(doc=>{

batch.delete(
doc.ref
);

});

await batch.commit();

console.log(

`Deleted ${snapshot.size} videos`

);

}

// ======================================================
// RUN
// ======================================================

cleanup()

.then(()=>{

console.log(
"Cleanup Complete"
);

process.exit(0);

})

.catch(err=>{

console.error(err);

process.exit(1);

});
