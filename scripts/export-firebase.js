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

const year =
now.getFullYear();

const month =
String(
now.getMonth()+1
).padStart(2,"0");

const day =
String(
now.getDate()
).padStart(2,"0");

const fileName =
`videos-${year}${month}${day}.json`;

const videosDir =
path.join(
process.cwd(),
"videos"
);

fs.mkdirSync(
videosDir,
{
recursive:true
}
);

// Delete old video files

fs.readdirSync(videosDir)

.filter(file=>

file.startsWith("videos-") &&
file.endsWith(".json")

)

.forEach(file=>{

fs.unlinkSync(

path.join(
videosDir,
file
)

);

});

// Write today's file

fs.writeFileSync(

path.join(
videosDir,
fileName
),

JSON.stringify(videos)

);

console.log(
`Exported ${videos.length} videos`
);

console.log(
`Created ${fileName}`
);

}

run()
.then(()=>{

console.log("Done");

process.exit(0);

})
.catch(err=>{

console.error(err);

process.exit(1);

});
