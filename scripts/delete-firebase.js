const admin = require("firebase-admin");

const serviceAccount = JSON.parse(
  process.env.FIREBASE_SERVICE_ACCOUNT
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function run() {

  console.log("Deleting Firebase videos...");

  const snapshot = await db
    .collection("videos")
    .get();

  if (snapshot.empty) {

    console.log("No videos found.");
    return;

  }

  let batch = db.batch();
  let batchCount = 0;
  let deleted = 0;

  for (const doc of snapshot.docs) {

    batch.delete(doc.ref);
    batchCount++;

    if (batchCount === 500) {

      await batch.commit();

      deleted += batchCount;
      batch = db.batch();
      batchCount = 0;

    }

  }

  if (batchCount > 0) {

    await batch.commit();
    deleted += batchCount;

  }

  console.log(`Deleted ${deleted} videos`);

}

run()
  .then(() => {

    console.log("Done");
    process.exit(0);

  })
  .catch(err => {

    console.error(err);
    process.exit(1);

  });
