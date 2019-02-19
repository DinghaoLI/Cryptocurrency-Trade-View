import dva from 'dva';
import 'babel-polyfill';
import './index.css';


// 1. Initialize
const app = dva({
});
// 2. Plugins
// app.use({});

// 3. Model
//app.model(require('./models/example').default);
// app.model(require('./models/trading').default);
app.model(require('./models/orderBook').default);
app.model(require('./models/lastMatch').default);

// 4. Router
app.router(require('./router').default);

// 5. Start
app.start('#root');
