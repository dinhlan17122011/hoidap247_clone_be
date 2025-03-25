require('dotenv').config();
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const app = express();
const port = 3000;

const morgan = require('morgan');
const cors = require('cors');
const { engine } = require('express-handlebars');
const methodOverride = require('method-override');
const path = require('path');

const errorMiddleware = require('./middlewares/errorMiddleware');
const limtierMiddeware = require('./middlewares/rateLimiter.js');

const connectDB = require('./config/data.js');

const UserRouters = require('./routes/api/UserRoutes.js');
const questionRouter = require('./routes/api/questionRouter.js');
const answerRoutes = require('./routes/api/answerRoutes.js');
const CommentRoutes = require('./routes/api/CommentRoutes.js');

const UserViewsRouter = require('./routes/views/UserViewsRouter.js');
const QuestionViewsRoutes = require('./routes/views/QuestionsViewsRouter.js');
const AnswerViewsRoutes = require('./routes/views/AnswerViewsRoutes.js');
const CommentViewsRouter = require('./routes/views/CommentViewsRouter.js');

app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(methodOverride('_method'));
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
app.set('views', path.join(__dirname, '../views'));

connectDB();
//API
app.use('/api/user', UserRouters);
app.use('/api/question', questionRouter);
app.use('/api/answer', answerRoutes);
app.use('/api/comment', CommentRoutes);
app.use('/comment',CommentViewsRouter)

//ROUTER VIEWS
app.use('/user', UserViewsRouter);
app.use('/question', QuestionViewsRoutes);
app.use('/answer', AnswerViewsRoutes);

app.get('/', (req, res) => {
    res.render('home');
});
console.log(app._router.stack);

server.listen(port, () => {
    console.log(path.join(__dirname, '../views'));

    console.log(`Example app listening on port ${port}`);
});
