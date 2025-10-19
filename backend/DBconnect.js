import mongoose from "mongoose"

const dbConnection = () => {
    const dbURI =  "mongodb+srv://sam:qIq04LO4jgfzmXFr@cluster0.vrla96y.mongodb.net/veristaAI?retryWrites=true&w=majority&appName=Cluster0";
    mongoose.connect(dbURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log("Database connection passed ✅");
    })
    .catch(err => {
        console.error("Error in connection db ❌", err);
    });
};

export default  dbConnection