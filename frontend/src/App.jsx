import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import EmployeeDashboard from './pages/EmployeeDashboard';
import PrivateRoutes from './utils/PrivateRoutes';
import RoleBaseRoutes from './utils/RoleBaseRoutes';
import DepartmentList from './components/Department/DepartmentList';
import AdminSummary from './components/dashboard/AdminSummary';
import AddDepartment from './components/Department/AddDepartment';
import EditDepartment from './components/Department/EditDepartment';
import List from './components/employee/List';
import Add from './components/employee/Add';
import View from './components/employee/view';
import Edit from './components/employee/Edit';
import Settings from './components/Settings/settings';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/admin-dashboard" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin-dashboard" element={

          <PrivateRoutes>
            <RoleBaseRoutes requiredRole={['admin']}>
              <AdminDashboard />
            </RoleBaseRoutes>
          </PrivateRoutes>

        } >

          <Route index element={<AdminSummary />} ></Route>
          <Route path="/admin-dashboard/departments" element={<DepartmentList />} ></Route>
          <Route path="/admin-dashboard/add-department" element={<AddDepartment />} ></Route>
          <Route path="/admin-dashboard/department/:id" element={<EditDepartment />} ></Route>
          <Route path="/admin-dashboard/employees" element={<List />} ></Route>
          <Route path="/admin-dashboard/add-employee" element={<Add />} ></Route>
          <Route path="/admin-dashboard/employee/:id" element={<View />} ></Route>
          <Route path="/admin-dashboard/employee/edit/:id" element={<Edit />} ></Route>


          <Route path="/admin-dashboard/settings" element={<Settings />} />


        </Route>
        <Route path="/employee-dashboard" element={<EmployeeDashboard />} />


      </Routes>
    </BrowserRouter>
  );
}

export default App;
