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
import EmployeeSummary from './components/EmployeeDashboard/EmployeeSummary';
import Profile from './components/EmployeeDashboard/Profile';
import LeaveList from './components/leave/list';
import AddLeave from './components/leave/add';
import Attendance from './components/attendance/Attendance';
import ScanAttendance from './components/attendance/ScanAttendance';
import EmpAttendance from './components/attendance/EmpAttendance';

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
          <Route path="/admin-dashboard/leaves" element={<LeaveList />} ></Route>
          <Route path="/admin-dashboard/attendance" element={<Attendance />} ></Route>

          <Route path="/admin-dashboard/settings" element={<Settings />} />

        </Route>


        <Route path="/employee-dashboard" element={
          <PrivateRoutes>
            <RoleBaseRoutes requiredRole={["admin", "employee"]}>
              <EmployeeDashboard />
            </RoleBaseRoutes>
          </PrivateRoutes>

        } >
          
          <Route index element={<EmployeeSummary/>} ></Route>
          <Route path="/employee-dashboard/profile/:id?" element={<Profile />} ></Route>
          <Route path="/employee-dashboard/leaves" element={<LeaveList />} ></Route>
          <Route path="/employee-dashboard/add-leave" element={<AddLeave />} ></Route>
          <Route path="/employee-dashboard/settings" element={<Settings />} />
          <Route path="/employee-dashboard/attendance" element={<EmpAttendance />} ></Route>
          <Route path="/employee-dashboard/add-attendance" element={<ScanAttendance />} ></Route>

        </Route>



      </Routes>
    </BrowserRouter>
  );
}

export default App;
