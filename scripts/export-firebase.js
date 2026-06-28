const admin = require("firebase-admin");
const fs = require("fs");
const path = require("path");

const serviceAccount = JSON.parse(
process.env.FIREBASE_SERVICE_ACCOUNT
);

admin.initializeApp({
credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function run(){

console.log("Export Started");

const snapshot =
await db
.collection("videos")
.orderBy("createdAt","desc")
.get();

const videos = [];

snapshot.forEach(doc=>{

const d = doc.data();

videos.push([
d.username || "",
d.videoId || ""
]);

});

const now = new Date();

const year = now.getFullYear();

const month = String(
now.getMonth()+1
).padStart(2,"0");

const day = String(
now.getDate()
).padStart(2,"0");

const fileName =
`videos-${year}${month}${day}.json`;

const dataDir =
path.join(
process.cwd(),
"videos"
);

fs.mkdirSync(
dataDir,
{recursive:true}
);

// Delete previous videos-*.json files
fs.readdirSync(dataDir)
.filter(file=>
file.startsWith("videos-") &&
file.endsWith(".json")
)
.forEach(file=>{

fs.unlinkSync(
path.join(dataDir,file)
);

});

// Write today's video file
fs.writeFileSync(

path.join(
dataDir,
fileName
),

JSON.stringify(videos)

);

// Write latest.json
fs.writeFileSync(

path.join(
dataDir,
"latest.json"
),

JSON.stringify({
file:fileName
})

);

console.log(
`Exported ${videos.length} videos`
);

console.log(
`Created ${fileName}`
);

}

run()
.then(()=>process.exit(0))
.catch(err=>{

console.error(err);

process.exit(1);

});
