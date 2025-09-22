document.addEventListener('DOMContentLoaded', () => {
    // --- DATA & CONSTANTS ---
    const CROP_WATER_DATA = { "Boro Rice": 1200, "Aman Rice": 800, "Wheat": 400, "Maize": 550, "Potato": 500, "Jute": 600, "Mustard": 350, "Lentil": 250, "Sugarcane": 1800 };
    const CONVERSION_TO_HECTARE = { decimal: 0.004047, katha: 0.006773, bigha: 0.1338, acre: 0.4047, hectare: 1.0 };
    const EQUIPMENT_DATA = [
        { name: "Sonalika Tractor", power: "55 HP", rates: { day: 4000, hour: 500 }, status: "Available", district: "Mymensingh", image: "https://placehold.co/600x400/22c55e/ffffff?text=Tractor" },
        { name: "Combine Harvester", power: "120 HP", rates: { day: 15000, hour: 2000 }, status: "Available", district: "Rajshahi", image: "https://placehold.co/600x400/f97316/ffffff?text=Harvester" },
        { name: "Modern Power Tiller", power: "15 HP", rates: { day: 1500, hour: 200 }, status: "Booked", district: "Dhaka", image: "https://placehold.co/600x400/3b82f6/ffffff?text=Power+Tiller" },
        { name: "Agri-Drone Sprayer", power: "N/A", rates: { day: 6000, hour: 800 }, status: "Available", district: "Rajshahi", image: "https://placehold.co/600x400/8b5cf6/ffffff?text=Drone" },
        { name: "High-Flow Irrigation Pump", power: "10 HP", rates: { day: 1000, hour: 150 }, status: "Available", district: "Mymensingh", image: "https://placehold.co/600x400/0ea5e9/ffffff?text=Pump" },
        { name: "Backpack Sprayer", power: "N/A", rates: { day: 500, hour: 70 }, status: "Available", district: "Dhaka", image: "https://placehold.co/600x400/ec4899/ffffff?text=Sprayer" },
    ];

    // --- DOM Elements ---
    const cropSelect = document.getElementById('crop-select');
    const areaInput = document.getElementById('area-input');
    const unitSelect = document.getElementById('unit-select');
    const calculateBtn = document.getElementById('calculate-btn');
    const resultContainer = document.getElementById('result-container');
    const waterResult = document.getElementById('water-result');
    const resultDetails = document.getElementById('result-details');
    const errorMessage = document.getElementById('error-message');
    const tabEn = document.getElementById('tab-en');
    const tabBn = document.getElementById('tab-bn');
    const tipsEn = document.getElementById('tips-en');
    const tipsBn = document.getElementById('tips-bn');
    const districtFilter = document.getElementById('district-filter');
    const equipmentCatalog = document.getElementById('equipment-catalog');


    // --- INITIALIZATION ---
    function initialize() {
        // Populate crop dropdown
        Object.keys(CROP_WATER_DATA).forEach(cropName => {
            const option = document.createElement('option');
            option.value = cropName;
            option.textContent = cropName;
            cropSelect.appendChild(option);
        });

        // Populate district filter and render equipment
        const districts = [...new Set(EQUIPMENT_DATA.map(item => item.district))];
        districts.forEach(district => {
            const option = document.createElement('option');
            option.value = district;
            option.textContent = district;
            districtFilter.appendChild(option);
        });
        renderEquipment(EQUIPMENT_DATA);
    }
    

    // --- EVENT LISTENERS ---
    calculateBtn.addEventListener('click', calculateWater);
    tabEn.addEventListener('click', () => switchTab('en'));
    tabBn.addEventListener('click', () => switchTab('bn'));
    districtFilter.addEventListener('change', filterEquipment);


    // --- FUNCTIONS ---
    function calculateWater() {
        const crop = cropSelect.value;
        const area = parseFloat(areaInput.value);
        const unit = unitSelect.value;

        if (!crop || isNaN(area) || area <= 0) {
            showError("Please select a crop and enter a valid land area.");
            return;
        }
        hideError();

        const areaInHectare = area * CONVERSION_TO_HECTARE[unit];
        const waterPerHectareMM = CROP_WATER_DATA[crop];
        const totalWaterLitres = areaInHectare * waterPerHectareMM * 10000;
        
        waterResult.textContent = totalWaterLitres.toLocaleString('en-US', { maximumFractionDigits: 0 });
        resultDetails.textContent = `Based on ${waterPerHectareMM} mm seasonal requirement for ${crop}.`;
        resultContainer.classList.remove('hidden');
    }

    function renderEquipment(items) {
        equipmentCatalog.innerHTML = '';
        if (items.length === 0) {
            equipmentCatalog.innerHTML = `<p class="text-gray-500 text-center md:col-span-2">No equipment found for the selected district.</p>`;
            return;
        }
        items.forEach(item => {
            const statusColor = item.status === 'Available' ? 'text-green-600' : 'text-red-600';
            const statusBg = item.status === 'Available' ? 'bg-green-100' : 'bg-red-100';
            
            const card = document.createElement('div');
            card.className = 'border rounded-lg overflow-hidden bg-white shadow';
            card.innerHTML = `
                <img src="${item.image}" alt="${item.name}" class="w-full h-48 object-cover">
                <div class="p-4">
                    <h3 class="text-xl font-bold">${item.name}</h3>
                    <p class="text-gray-600">${item.power}</p>
                    <div class="flex justify-between items-center mt-2">
                        <p class="text-gray-800 font-semibold">${item.rates.day} BDT/day</p>
                        <p class="text-sm text-gray-500">${item.rates.hour} BDT/hour</p>
                    </div>
                    <div class="flex justify-between items-center mt-4">
                       <span class="font-semibold py-1 px-3 rounded-full text-sm ${statusColor} ${statusBg}">${item.status}</span>
                       <a href="tel:+880123456789" class="bg-sky-600 text-white px-4 py-2 rounded-md hover:bg-sky-700 transition">
                          <i class="fas fa-phone-alt mr-1"></i> Contact
                       </a>
                    </div>
                </div>
            `;
            equipmentCatalog.appendChild(card);
        });
    }

    function filterEquipment() {
        const selectedDistrict = districtFilter.value;
        if (selectedDistrict === 'all') {
            renderEquipment(EQUIPMENT_DATA);
        } else {
            const filtered = EQUIPMENT_DATA.filter(item => item.district === selectedDistrict);
            renderEquipment(filtered);
        }
    }

    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.classList.remove('hidden');
        resultContainer.classList.add('hidden');
    }

    function hideError() {
        errorMessage.classList.add('hidden');
    }
    
    function switchTab(lang) {
        if (lang === 'en') {
            tabEn.classList.add('active');
            tabBn.classList.remove('active');
            tipsEn.classList.remove('hidden');
            tipsBn.classList.add('hidden');
        } else {
            tabBn.classList.add('active');
            tabEn.classList.remove('active');
            tipsBn.classList.remove('hidden');
            tipsEn.classList.add('hidden');
        }
    }
    
    // --- RUN ON LOAD ---
    initialize();
});
