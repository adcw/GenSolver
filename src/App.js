import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Inputs from './components/Inputs';
import RowDivider from './components/RowDivider';

function App() {

  return (

    <div className="container-fluid">

        <div className="row">
          <div className="col bg-second shadowed">
            <h1 className="heading">GenSolver</h1>
          </div>
        </div>

        <RowDivider/>

        <div className="row">
          <div className="col-md-6">
            <div className="mycard bg-second">
              <Inputs></Inputs>
            </div>
          </div>

          <div className="col-md-6">
            <div className="mycard bg-second"></div>
          </div>
        </div>

    </div>
  );
}

export default App;
