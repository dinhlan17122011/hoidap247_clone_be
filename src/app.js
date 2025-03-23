require('dotenv').config();
const express = require('express');
const app = express();
const port = 3000;

const morgan = require('morgan');
const cors = require('cors');
const { engine } = require('express-handlebars');
const path = require('path');
const errorMiddleware = require("./middlewares/errorMiddleware");

const connectDB = require('./config/data.js');

const UserRouters = require('./routes/UserRoutes.js');
const questionRouter = require('./routes/questionRouter.js');
const answerRoutes = require('./routes/answerRoutes.js');
const CommentRoutes = require('./routes/CommentRoutes.js')
const reportRoutes = require("./routes/reportRoutes");

app.use(morgan('combined'));
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
app.use(errorMiddleware);

app.engine(
    'hbs',
    engine({
        extname: '.hbs',
    }),
);
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, './views'));

connectDB();

app.use('/api/user', UserRouters);
app.use('/api/question', questionRouter);
app.use('/api/answer', answerRoutes);
app.use('/api/comment', CommentRoutes);
app.use("/api/reports", reportRoutes);

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
