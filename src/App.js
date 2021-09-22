import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './utils/FontAwesomeIcons.js';
import GenInputForm from './components/inputSection/GenInputForm';
import RowDivider from './utils/RowDivider';
import RuleSection from './components/ruleSection/RuleSection';

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
              <GenInputForm/>
              <RuleSection/>
          </div>

          <div className="col-md-6">
            <div className="mycard bg-second shadowed"></div>
          </div>
        </div>

    </div>
  );
}

export default App;
