require('dotenv').config();
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const app = express();
const port = 3000;

const morgan = require('morgan');
const cors = require('cors');
const { engine } = require('express-handlebars');
const path = require('path');

const errorMiddleware = require('./middlewares/errorMiddleware');
const limtierMiddeware = require('./middlewares/rateLimiter.js');

const connectDB = require('./config/data.js');

const UserRouters = require('./routes/UserRoutes.js');
const questionRouter = require('./routes/questionRouter.js');
const answerRoutes = require('./routes/answerRoutes.js');
const CommentRoutes = require('./routes/CommentRoutes.js');
const reportRoutes = require('./routes/reportRoutes');

app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

app.use(errorMiddleware);
app.use(limtierMiddeware);

const server = http.createServer(app);
const io = socketIo(server);

io.on('connection', (socket) => {
    console.log('Người dùng đã kết nối');
    socket.on('newAnwer', (data) => {
        io.emit('ipdateAnswers', data);
    });

    socket.on('disconnect', () => {
        console.log('Nguời dùng offline');
    });
});

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
app.use('/api/reports', reportRoutes);

app.get('/', (req, res) => {
    res.render('home');
});

console.log(app._router.stack);

server.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
