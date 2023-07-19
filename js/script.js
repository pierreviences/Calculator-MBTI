// deklarasi
const homeSection = document.getElementById('home');
const resultSection = document.getElementById('result');
const calculateButton = document.querySelector('#home button[type="submit"]');
const backButton = document.querySelector('#result button[type="button"]');

// Daftar kategori berdasarkan BMI
const categories = ["Kekurangan Berat Badan", "Normal", "Kelebihan Berat Badan", "Kegemukan (Obesitas)"];

// Rentang BMI berdasarkan jenis kelamin
const bmiCategories = {
    pria: [
        { minBmi: -Infinity, maxBmi: 18.4 },
        { minBmi: 18.5, maxBmi: 24.9 },
        { minBmi: 25, maxBmi: 29.9 },
        { minBmi: 30, maxBmi: Infinity }
    ],
    wanita: [
        { minBmi: -Infinity, maxBmi: 16.9 },
        { minBmi: 17, maxBmi: 23.9 },
        { minBmi: 24, maxBmi: 27 },
        { minBmi: 28, maxBmi: Infinity }
    ]
};

// Status kategori berdasarkan BMI
const statuses = [
    "Anda memiliki berat badan kurang dari normal.",
    "Anda memiliki berat badan dalam kisaran normal.",
    "Anda memiliki berat badan lebih dari normal.",
    "Anda memiliki berat badan dalam kategori kegemukan (obesitas)."
];

// Saran berdasarkan kategori BMI
const suggestion = {
    [categories[0]]: "Jika BMI Anda berada dalam kategori ini maka Anda dianjurkan untuk menambah berat badan hingga batas normal.",
    [categories[1]]: "Jika BMI Anda berada dalam kategori ini maka Anda memiliki berat badan yang sehat.",
    [categories[2]]: "Jika BMI Anda berada dalam kategori ini maka Anda dianjurkan untuk menurunkan berat badan hingga batas normal.",
    [categories[3]]: "Jika BMI Anda berada dalam kategori ini maka Anda dianjurkan untuk mengurangi berat badan hingga batas normal."
};

// Nasihat berdasarkan kategori BMI
const advice = {
    [categories[0]]: "Perbanyak asupan makanan bergizi dan konsultasikan dengan ahli gizi untuk peningkatan berat badan.",
    [categories[1]]: "Lanjutkan gaya hidup sehat dengan pola makan seimbang dan olahraga teratur.",
    [categories[2]]: "Lakukan penyesuaian pola makan dan rutin berolahraga untuk menurunkan berat badan.",
    [categories[3]]: "Segera konsultasikan dengan ahli gizi untuk penurunan berat badan yang sehat."
};

// Penyakit yang berhubungan dengan kategori BMI
const diseases = {
    "Kekurangan Berat Badan": ['Anemia', 'Osteoporosis', 'Gangguan pertumbuhan', 'Gangguan reproduksi'],
    "Normal": ['Tidak ada'],
    "Kelebihan Berat Badan": ['Hipertensi', 'Kolesterol tinggi', 'Jantung koroner'],
    "Kegemukan (Obesitas)": ['Stroke', 'Diabetes melitus', 'Kanker', 'Gangguan pernapasan', 'Gangguan reproduksi']
};

// Menampilkan bagian hasil pada halaman
const showResultSection = () => {
    homeSection.classList.add('hidden');
    resultSection.classList.remove('hidden');
};

// Menampilkan bagian beranda pada halaman
const showHomeSection = () => {
    resultSection.classList.add('hidden');
    homeSection.classList.remove('hidden');
    document.getElementById("myForm").reset();
};

// Tombol kembali pada bagian hasil
backButton.addEventListener('click', (event) => {
    event.preventDefault();
    showHomeSection();
});

// Fungsi untuk mereset form input
const resetForm = () => {
    document.getElementById("myForm").reset();
};

// Event listener saat tombol "Hitung MBI" ditekan
calculateButton.addEventListener('click', (event) => {
    event.preventDefault();
    const gender = getGender();
    const weight = document.getElementById("beratBadan").value;
    const age = document.getElementById("usia").value;
    const height = document.getElementById("tinggiBadan").value;
    if (validateInputForm(gender, weight, age, height)) {
        calculateBMI(weight, height, displayResult);
    }
});

// Menghitung nilai BMI
const calculateBMI = (weight, height, result) => {
    const convertedWeight = parseFloat(weight);
    const convertedHeight = parseFloat(height) / 100;
    const bmi = convertedWeight / (convertedHeight * convertedHeight);
    const formattedBMI = bmi.toFixed(2);
    const category = getCategory(bmi);
    const statusCategory = getStatusCategory(category);
    const { minBmi, maxBmi } = getBmiRange(category);
    result(formattedBMI, category, statusCategory, minBmi, maxBmi);
};

// Menampilkan hasil perhitungan BMI pada halaman
const displayResult = (formattedBMI, category, statusCategory, minBmi, maxBmi) => {
    setTextContent("hasilBMI", formattedBMI);
    setTextContent("kategori", category);
    setTextContent("kategoriTubuh", `Beberapa resiko penyakit yang berasal dari tubuh ${category}`);
    setTextContent("statusKategori", statusCategory);
    setTextContent("saran", suggestion[category]);
    setTextContent("nasihat", advice[category]);
    if (isFinite(minBmi)) {
        if (isFinite(maxBmi)) {
            setTextContent("antaraBMI", `Hasil BMI diantara ${minBmi} dan ${maxBmi}`);
        } else {
            setTextContent("antaraBMI", `Hasil BMI diantara ${minBmi} - ?`);
        }
    } else if (isFinite(maxBmi)) {
        setTextContent("antaraBMI", `Hasil BMI diantara ? - ${maxBmi}`);
    } else {
        setTextContent("antaraBMI", "Hasil BMI diantara -");
    }
    displayDiseases(category);
};

// Mengatur teks konten pada elemen dengan ID yang diberikan
const setTextContent = (elementId, value) => {
    document.getElementById(elementId).textContent = value;
};

// Menampilkan daftar penyakit yang berhubungan dengan kategori BMI pada halaman
const displayDiseases = (category) => {
    const diseaseList = diseases[category];
    const diseaseElement = document.getElementById("penyakit");
    diseaseElement.innerHTML = "";

    if (diseaseList.length > 0) {
        diseaseList.forEach((disease) => {
            const listItem = document.createElement("li");
            listItem.textContent = disease;
            diseaseElement.appendChild(listItem);
        });
    } else {
        const listItem = document.createElement("li");
        listItem.textContent = "Tidak ada penyakit yang terkait dengan kategori ini.";
        diseaseElement.appendChild(listItem);
    }
};

// Mendapatkan jenis kelamin yang dipilih
const getGender = () => {
    const genderValues = document.getElementsByName("jenisKelamin");
    let gender;
    for (let i = 0; i < genderValues.length; i++) {
        if (genderValues[i].checked) {
            gender = genderValues[i].value;
            break;
        }
    }
    return gender;
};

// Mendapatkan rentang BMI berdasarkan kategori
const getBmiRange = (category) => {
    const gender = getGender();
    const genderCategories = bmiCategories[gender.toLowerCase()];
    const index = categories.indexOf(category);
    if (index !== -1) {
        return genderCategories[index];
    }
    return { minBmi: '', maxBmi: '' };
};

// Mendapatkan status kategori berdasarkan BMI
const getStatusCategory = (category) => {
    let statusCategory;
    const index = categories.indexOf(category);
    if (index !== -1) {
        statusCategory = statuses[index];
    }
    return statusCategory;
};

// Mendapatkan kategori berdasarkan BMI
const getCategory = (bmi) => {
    const gender = getGender();
    let category;
    const genderCategories = bmiCategories[gender.toLowerCase()];
    for (let i = 0; i < genderCategories.length; i++) {
        if (bmi >= genderCategories[i].minBmi && bmi <= genderCategories[i].maxBmi) {
            category = categories[i];
            break;
        }
    }
    return category;
};

// Validasi input form
const validateInputForm = (gender, weight, age, height) => {
    if (typeof gender === 'undefined') {
        alert("Harap pilih jenis kelamin!");
        return false;
    }
    if (weight === "" || age === "" || height === "") {
        alert("Harap isi semua inputan terlebih dahulu!");
        return false;
    }
    if (isNaN(weight) || isNaN(age) || isNaN(height)) {
        alert("Harap masukkan angka pada input berat badan, usia, dan tinggi badan!");
        return false;
    }
    if (weight <= 0 || age <= 0 || height <= 0) {
        alert("Harap masukkan angka di atas 0 pada input berat badan, usia, dan tinggi badan!");
        return false;
    }
    showResultSection();
    return true;
};
