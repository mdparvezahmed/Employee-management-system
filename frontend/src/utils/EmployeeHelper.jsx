import axios from "axios";
import { useNavigate } from "react-router-dom";

export const fetchDepartments = async () => {
    let departments;
    try {
        const response = await axios.get('http://localhost:7000/api/department',
            {
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                }
            }
        );
        const data = await response.data;
        if (data.success) {
            departments = data.departments;
        }
    } catch (error) {
        if (error.response && !error.response.data.success) {
            alert(error.response.data.error);
        }
    }

    return departments;
};


export const getColumns = (isMobile = false) => [
    {
        name: "S No.",
        selector: (row) => row.sno,
        width: "80px",
        style: {
            textAlign: 'center',
        },
    },
    {
        name: "Image",
        selector: (row) => row.profileImage,
        cell: (row) => (
            <div className="flex justify-center">
                <img
                    src={`http://localhost:7000/uploads/${row.profileImage}`}
                    alt={row.name}
                    className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full object-cover"
                    onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/48x48?text=No+Image';
                    }}
                />
            </div>
        ),
        width: "100px",
        ignoreRowClick: true,
    },
    {
        name: "Employee Name",
        selector: (row) => row.name,
        sortable: true,
        wrap: true,
        width: "200px",
    },
    ...(!isMobile ? [{
        name: "Date Joined",
        selector: (row) => row.dateJoined,
        sortable: true,
        wrap: true,
        width: "150px",
    }] : []),
    {
        name: "Department Name",
        selector: (row) => row.dep_name,
        sortable: true,
        wrap: true,
        width: "180px",
    },
    {
        name: "Actions",
        selector: (row) => row.action,
        width: isMobile ? "220px" : "350px",
        style: {
            textAlign: 'right',
        },
        ignoreRowClick: true,
    }
];

// Legacy export for backward compatibility
export const columns = getColumns();


export const EmployeeButtons = ({ _id }) => {
    const navigate = useNavigate();

    return (
        <div className="flex gap-2 justify-end items-center">
            <button
                className="bg-blue-500 hover:bg-blue-600 text-white font-medium px-3 py-1.5 rounded text-sm transition-colors duration-200 whitespace-nowrap"
                onClick={() => navigate(`/admin-dashboard/employee/${_id}`)}
                title="View Employee"
            >
                View
            </button>
            <button
                className="bg-green-500 hover:bg-green-600 text-white font-medium px-3 py-1.5 rounded text-sm transition-colors duration-200 whitespace-nowrap"
                onClick={() => navigate(`/admin-dashboard/employee/edit/${_id}`)}
                title="Edit Employee"
            >
                Edit
            </button>
            <button
                className="bg-purple-500 hover:bg-purple-600 text-white font-medium px-3 py-1.5 rounded text-sm transition-colors duration-200 whitespace-nowrap"
                title="Manage Salary"
            >
                Salary
            </button>
            <button
                className="bg-orange-500 hover:bg-orange-600 text-white font-medium px-3 py-1.5 rounded text-sm transition-colors duration-200 whitespace-nowrap"
                title="Manage Leave"
            >
                Leave
            </button>
        </div>
    )
}