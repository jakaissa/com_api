const express = require("express");
const app = express();
const cors = require("cors");
const { MongoClient } = require("mongodb");
var bodyParser = require("body-parser");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
//app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded());

app.use(cors({}));
//app.use(express.static("upload"));
app.use("/upload", express.static(__dirname + "/upload"));
const port = 3000;

let data = [];

// mongodb client
var url =
  "mongodb+srv://babi:babi27@sandbox.qhrlxb8.mongodb.net/?retryWrites=true&w=majority";
var client = new MongoClient(url);

const db = client.db("commercial").collection("data");

// MULTER UPLOAD
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "./uploads");
//   },
//   filename: function (req, file, cb) {
//     console.log(req.body.age);
//     //
//     fs.mkdirSync(`./uploads/`);
//     //
//     const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
//     cb(null, file.originalname.split(".")[0].toLowerCase() + ".png");
//   },
// });
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log(req.body);
    const { name } = req.body;
    const dir = `./upload/${name}`;
    fs.exists(dir, (exist) => {
      if (!exist) {
        return fs.mkdir(dir, (error) => cb(error, dir));
      }
      return cb(null, dir);
    });
  },
  filename: (req, file, cb) => {
    const { name } = req.body;
    cb(null, file.originalname.split(".")[0].toLowerCase() + ".png");
  },
});
const upload = multer({ storage: storage });

app.post("/upload", upload.array("photos", 12), async (req, res) => {
  res.json({ message: "success" });
});
//

//app.use(express.static(path.join(__dirname, "..", "public")));

app.get("/test", async (req, res) => {
  let data = await db.find({});
  res.json(data);
});

function reshapeData(data) {
  // new columns products
  let q1 = "01. Quel produit STYLE CHIC utilisez-vous actuellement?";
  let q2 =
    "02. Quelle marque de poudre d??colorante (D??capage) disponible sur le march?? utilisez-vous actuellement";
  let q3 =
    " 03. Que pouvons-nous am??liorer sur la poudre d??colorante STYLE CHIC";
  let q4 =
    "04. En moyenne, combien utilisez-vous en quantit?? de poudre d??colorante par jour ";
  let q5 =
    "05. Quelle marque de cr??me coiffante (Brillantine) disponible sur le march?? utilisez-vous actuellement ";
  let q6 = "06. Que pouvons-nous am??liorer sur la Cr??me coiffante STYLE CHIC ";
  let q7 =
    "07. Quelle marque de S??rum Capillaire disponible sur le march?? utilisez-vous ";
  let q8 = "08. Que pouvons-nous am??liorer sur le S??rum capillaire STYLE CHIC ";
  let q9 = "09. Donnez une note pour chacun des produits STYLE CHIC ci-dessous";
  let q91 = "Poudre D??colorante SILVER X2";
  let q92 = "Poudre D??colorante GOLD X3";
  let q93 = "S??rum Capillaire";
  let q94 = "Cr??me Coiffante (Brillantine)";
  let q10 = "10. Quels sont les points forts des produits STYLE CHIC ";
  let q11 = "11. Quels sont les points faibles des produits STYLE CHIC ";
  let q12 =
    "12. Donnez une note pour ??valuer le Packaging (Emballage) de nos produits";
  let q13 =
    "13. Que pouvons-nous am??liorer sur le packaging (Emballage) de nos produits?";
  let q14 =
    "14. Quelle note attribuez-vous au rapport qualit??/prix de nos produits";
  let q15 = "15. Aupr??s de quel point de vente achetez-vous vos produits";
  let q16 = "16. Avez-vous test?? la nouvelle cr??me oxydante STYLE CHIC";
  let q17 = "17. Attribuez une note pour la cr??me oxydante STYLE CHIC";
  let q18 =
    "18. En moyenne, combien utilisez vous en quantit?? de cr??me oxydante par jour";
  let q19 =
    "19. Quel nouveau produit souhaitez-vous que STYLE CHIC produise pour vous";
  let q20 =
    "20. Recommanderiez-vous les produits STYLE CHIC ?? vos Clients ou ?? d'autres Salons de Coiffure";
  let q21 =
    "21. Avez-vous rencontr?? des probl??mes lors de l'utilisation d'un de nos produits";
  let q211 = "21.1 Quel est le Produit concern??";
  let q212 = " 21.2 Quel ??tait le probl??me rencontr?? ";
  let q22 =
    "22. Souhaitez-vous ajouter quelque chose concernant STYLE CHIC qui ne vous a pas ??t?? demand?? dans ce formulaire";
  let q221 = "22.1 Si oui, merci de pr??ciser ce dont il s???agit:";
  let q23 = "23. Pouvons-nous donner suite ?? vos r??ponses en vous contactant";
  let ncp = {
    q1: "oui",
  };
  if (data.products == "aucun") {
    ncp[q1] = "aucun";
    data.product = "";
  }

  var dateObj = new Date();
  var month = dateObj.getUTCMonth() + 1; //months from 1-12
  var day = dateObj.getUTCDate();
  var year = dateObj.getUTCFullYear();

  let newdate = year + "/" + month + "/" + day;
  let newdata = {
    Date: newdate,
    "Nom et prenom": data.fullname,
    "Salon de coiffure": data.ccenter,
    "Notation du Salon": data.snotation,
    Email: data.email,
    T??l??phone: data.tel,
    Adresse: data.adresse,
    "adresse gps": data.position,
    Wilaya: data.wilaya,
    "Code Postal": data.cposte,
    Pays: data.pays,
    Facebook: data.facebook,
    Instagram: data.instagram,
    q1: ncp[q1],
    [q1]: data.products,
    [" " + q2]: data.reponse2,
    [" " + q3]: data.reponse3,
    [" " + q4]: data.reponse4,
    [" " + q5]: data.reponse5,
    [" " + q6]: data.reponse6,
    [" " + q7]: data.reponse7,
    [" " + q8]: data.reponse8,
    [" " + q9]: q9,
    [" " + q91]: data.pdsnote,
    [" " + q92]: data.pdgnote,
    [" " + q93]: data.stylenote,
    [" " + q94]: data.cremenote,
    [" " + q10]: data.pointfr,
    [" " + q11]: data.pointfb,
    [" " + q12]: data.reponse12,
    [" " + q13]: data.reponse13,
    [" " + q14]: data.reponse14,
    [" " + q15]: data.pointachat,
    [" " + q16]: data.reponse16,
    [" " + q17]: data.reponse17,
    [" " + q18]: data.reponse18,
    [" " + q19]: data.reponse19,
    [" " + q20]: data.reponse20,
    [" " + q21]: data.reponse21,
    [" " + q211]: data.reponse211,
    [" " + q212]: data.reponse212,
    [" " + q22]: data.reponse22,
    [" " + q221]: data.reponse221,
    [" " + q23]: data.reponse23,
  };
  return newdata;
}

app.get("/infos", (req, res) => {
  res.json(data);
});

app.post("/test", async (req, res) => {
  console.log(req.body);
  let test = await db.insertOne(req.body);

  res.status(201).send({ data: test });
});
app.post("/login", async (req, res) => {
  console.log(req.body);
  let test = await db.findOne({
    $and: [{ id: req.body.id }, { password: req.body.password }],
  });
  if (test == null) {
    return res.status(401).send({ data: test });
  }

  res.status(201).send({ data: test });
});

app.post("/data", async (req, res) => {
  console.log(req.body);
  let rdata = req.body;
  data.push(rdata);
  let newdata = reshapeData(rdata);
  try {
    await db.insertOne(newdata);
    console.log("data sendded");
  } catch (e) {
    console.log("error happen");
  }

  res.status(200).json({ msg: "sucess" });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
