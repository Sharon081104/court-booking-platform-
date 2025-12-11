// frontend/src/components/Admin/CourtConfiguration.jsx

const CourtConfiguration = () => {
    // State for form data (selectedCourtId, newPrice, isActive)

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            // API call to PUT /api/courts/admin/${selectedCourtId}
            // axios.put(`/api/courts/admin/${selectedCourtId}`, { basePrice: newPrice, isActive });
            alert('Court price updated successfully!');
        } catch (error) {
            alert('Failed to update court.');
        }
    };
    
    // ... JSX with dropdowns and input fields ...
};