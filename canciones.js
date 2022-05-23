const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const app = express();
const router = express.Router();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

mongoose
  .connect(
    "mongodb+srv://George:vFyxnj0oMZQA212U@jorgetests.gmaz5.mongodb.net/cancionesDB?retryWrites=true&w=majority"
  )
  .catch((error) => handleError(error));

const cancionSchema = new mongoose.Schema(
  {
    //_id: mongoose.Schema.Types.ObjectId,
    artista: String,
    cancion: String,
    pais: String,
    album: String,
    anio: Number,
  },
  {
    collection: "Canciones",
  }
);
//const Persona = mongoose.model("Persona", personaSchema);
const Cancion = mongoose.model("Cancion", cancionSchema);

router.get("/canciones", (req, res) => {
  Cancion.find((err, canciones) => {
    if (err) res.status(500).send("Error en la base de datos1");
    else res.status(200).json(canciones);
  });
});

router.get("/canciones/year", function (req, res) {
  // hace un query de los documentos
  Cancion.find({ anio: req.query.anio }, function (err, canciones) {
    if (err) {
      console.log(err);
      res.status(500).send("Error al leer de la base de datos2");
    } else res.status(200).json(canciones);
  });
});

router.get("/canciones/betyears", function (req, res) {
  // hace un query de los documentos
  Cancion.find(
    { anio: { $gt: req.query.anio, $lte: req.query.anio1 } },
    function (err, canciones) {
      if (err) {
        console.log(err);
        res.status(500).send("Error al leer de la base de datos3");
      } else res.status(200).json(canciones);
    }
  );
});

router.get("/canciones/artista", function (req, res) {
  Cancion.find({ artista: req.query.artista }, function (err, canciones) {
    if (err) {
      console.log(err);
      res.status(500).send("Error al leer de la BD x Artista");
    } else res.status(200).json(canciones);
  });
});

router.get("/canciones/:id", function (req, res) {
  // busca un registro por id
  Cancion.findById(req.params.id, function (err, cancion) {
    if (err) res.status(500).send("Error en la base de datos4 ");
    else {
      if (cancion != null) {
        res.status(200).json(cancion);
      } else res.status(404).send("No se encontro esa cancion");
    }
  });
});

router.post("/canciones", function (req, res) {
  const cancion1 = new Cancion({
    artista: req.body.artista,
    cancion: req.body.cancion,
    pais: req.body.pais,
    album: req.body.album,
    anio: req.body.anio,
  });
  // guarda una musica en la base de datos
  cancion1.save(function (error, cancion1) {
    if (error) {
      res.status(500).send("No se ha podido agregar.");
    } else {
      res.status(200).json(cancion1); // envía al cliente el id generado
    }
  });
});

// modificar un registro
router.put("/canciones/:id", function (req, res) {
  // Modificar con Find ID
  Cancion.findById(req.params.id, function (err, cancion) {
    if (err) res.status(500).send("Error en la base de datos");
    else {
      if (cancion != null) {
        cancion.cancion = req.body.cancion;
        cancion.artista = req.body.artista;
        cancion.anio = req.body.anio;
        cancion.pais = req.body.pais;
        cancion.album = req.body.album;

        cancion.save(function (error, cancion1) {
          if (error) res.status(500).send("Error en la base de datos");
          else {
            res.status(200).send("Modificado exitosamente");
          }
        });
      } else res.status(404).send("No se encontro esa cancion");
    }
  });
});

// eliminar un registro
router.delete("/canciones/:id", function (req, res) {
  // Eliminar con Find ID
  Cancion.findById(req.params.id, function (err, cancion) {
    if (err) res.status(500).send("Error en la base de datos");
    else {
      if (cancion != null) {
        cancion.remove(function (error, result) {
          if (error) res.status(500).send("Error en la base de datos");
          else {
            res.status(200).send("Eliminado exitosamente");
          }
        });
      } else res.status(404).send("No se encontro esa cancion");
    }
  });
});

module.exports = router;
