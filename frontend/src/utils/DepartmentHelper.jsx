import axios from "axios";
import { useNavigate } from "react-router-dom";

export const columns = [
    {
        name: "S_NO",
        selector: (row) => row.sno,
    },
    
    {
        name: "Department Name",
        selector: (row) => row.dep_name,
        sortable: true,
    },
    {
        name: "Action",
        selector: (row) => row.action,
    }

]

export const DepartmentButtons = ({ _id, onDepartmentDelete }) => {
    const navigate = useNavigate();
    const handleDelete = async (ID) => {
        const confirm = window.confirm("Are you sure you want to delete this department?");
        if (confirm) {
            try {
                const response = await axios.delete(`http://localhost:7000/api/department/${ID}`,
                    {
                        headers: {
                            "Authorization": `Bearer ${localStorage.getItem("token")}`
                        }
                    }
                );
                if (response.data.success) {
                    onDepartmentDelete(ID);
                }
            } catch (error) {
                if (error.response && !error.response.data.success) {
                    alert(error.response.data.message || 'Error deleting department');
                }
            }
        }
    }
    return (
        <div className="flex gap-2">
            <button 
                className="bg-yellow-500 hover:bg-yellow-600 text-white font-medium px-3 py-1 rounded text-sm transition-colors duration-200"
                onClick={() => navigate(`/admin-dashboard/department/${_id}`)}
            >
                Edit
            </button>
            <button 
                className="bg-red-500 hover:bg-red-600 text-white font-medium px-3 py-1 rounded text-sm transition-colors duration-200"
                onClick={() => handleDelete(_id)}
            >
                Delete
            </button>
        </div>
    )
}