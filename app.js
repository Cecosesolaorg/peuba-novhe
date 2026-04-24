
        
        const DEFAULT_IMAGE_URL = 'https://placehold.co/32x32/7e22ce/ffffff?text=P'; 
        const LOCAL_STORAGE_KEY = 'wasteDataStore_V2'; 
        const RESPONSIBLE_SELECTED_KEY = 'currentSingleResponsible'; 
        const CUSTOM_PRODUCTS_KEY = 'customProductsList'; 
        const SUPPLIERS_LIST_KEY = 'savedSuppliersList'; 
        const PRODUCT_NOTES_KEY = 'wasteProductNotes'; 
        const ACTIVE_KEY_STORAGE = 'activeContextKey_V2';
        const ACTIVE_LABEL_STORAGE = 'activeContextLabel_V2';
        const ACTIVE_SUPPLIER_STORAGE = 'activeContextSupplier_V2';
        const SWIPE_THRESHOLD = 50; 

        // --- TOAST NOTIFICATIONS FUNCTION ---
        window.showToast = function(message, type = 'default') {
            const container = document.getElementById('toast-container');
            const toast = document.createElement('div');
            toast.className = `toast ${type}`;
            toast.textContent = message;
            
            container.appendChild(toast);
            
            // Trigger animation
            requestAnimationFrame(() => {
                toast.classList.add('show');
            });

            // Remove after 3 seconds
            setTimeout(() => {
                toast.classList.remove('show');
                setTimeout(() => {
                    container.removeChild(toast);
                }, 300);
            }, 3000);
        };

        // --- NUEVA LISTA DE CONTEXTOS (SEDES) ---
        const contextKeys = [
            "SAN ROQUE", "MARAJABU", "ESTIBANDA", "LAS ROSAS", "ESTIGUATE", 
            "SAN NICOLAS", "RIO CLARO", "LAS LAJITAS", "ASOPRODELCA", "EL ENCANTO", 
            "MONTE CARMEL", "CARACHE", "BOJO", "AGUA AZUL", "LA TRIGUERA", 
            "LA MONTAÑA", "LA GRANJA", "TREBOL", "CULEBRINAS", "CABIMBU", "SAN CARLOS",
            "PROVEEDOR"
        ];
        
        const contextMap = {
            "SAN ROQUE": "san_roque",
            "MARAJABU": "marajabu",
            "ESTIBANDA": "estibanda",
            "LAS ROSAS": "las_rosas",
            "ESTIGUATE": "estiguate",
            "SAN NICOLAS": "san_nicolas",
            "RIO CLARO": "rio_claro",
            "LAS LAJITAS": "las_lajitas",
            "ASOPRODELCA": "asoprodelca",
            "EL ENCANTO": "el_encanto",
            "MONTE CARMEL": "monte_carmel",
            "CARACHE": "carache",
            "BOJO": "bojo",
            "AGUA AZUL": "agua_azul",
            "LA TRIGUERA": "la_triguera",
            "LA MONTAÑA": "la_montana",
            "LA GRANJA": "la_granja",
            "TREBOL": "trebol",
            "CULEBRINAS": "culebrinas",
            "CABIMBU": "cabimbu",
            "SAN CARLOS": "san_carlos",
            "PROVEEDOR": "proveedor"
        };
        
        // --- VARIABLES DE ESTADO Y PERSISTENCIA ---
        let dataContext = null; 
        let viewMode = 'entry'; 
        
        // VARIABLES PARA RECORDAR LA SELECCIÓN ANTERIOR (Persistentes)
        let currentActiveKey = localStorage.getItem(ACTIVE_KEY_STORAGE) || "SELECCIONAR";
        let currentActiveLabel = localStorage.getItem(ACTIVE_LABEL_STORAGE) || "SELECCIONE GRUPO O PROVEEDOR";

        // Variable global para recordar qué acordeón se editó por última vez y mantenerlo abierto
        let lastEditedGroupContext = null;

        let localWasteStore = loadLocalStore();
        let currentContextData = localWasteStore[dataContext] || {};
        
        let currentResponsible = localStorage.getItem(RESPONSIBLE_SELECTED_KEY) || 'SIN ASIGNAR';
        let currentSupplier = localStorage.getItem(ACTIVE_SUPPLIER_STORAGE) || ''; 

        // CARGAR LISTA DE PROVEEDORES GUARDADOS
        let savedSuppliers = JSON.parse(localStorage.getItem(SUPPLIERS_LIST_KEY)) || [];
        // CARGAR NOTAS DE PRODUCTOS
        let productNotes = JSON.parse(localStorage.getItem(PRODUCT_NOTES_KEY)) || {};

        // Variables Swipe
        let touchStartX = 0;
        let touchEndX = 0;
        let isSwiping = false;

        // Variables Temporales para el flujo de registro
        let tempProductId = "";
        let tempProductName = "";
        let tempWeight = 0;

        const baseProductList = [
            { name: "ACELGA", imageUrl: "https://placehold.co/32x32/15803d/ffffff?text=Ac" },
            { name: "AGUACATE", imageUrl: "https://placehold.co/32x32/65a30d/ffffff?text=Ag" },
            { name: "AJÍ ROSITA", imageUrl: "https://placehold.co/32x32/dc2626/ffffff?text=Aj" },
            { name: "AJO PORRO", imageUrl: "https://placehold.co/32x32/3f6212/ffffff?text=Ap" },
            { name: "APIO CRIOLLO", imageUrl: "https://placehold.co/32x32/ca8a04/ffffff?text=AC" },
            { name: "APIO ESPAÑA", imageUrl: "https://placehold.co/32x32/6d28d9/ffffff?text=AE" },
            { name: "AUYAMA", imageUrl: "https://placehold.co/32x32/f97316/ffffff?text=Au" },
            { name: "BATATA", imageUrl: "https://placehold.co/32x32/9333ea/ffffff?text=Ba" },
            { name: "BERENJENA", imageUrl: "https://placehold.co/32x32/6b21a8/ffffff?text=Be" },
            { name: "BRÓCOLIS", imageUrl: "https://placehold.co/32x32/16a34a/ffffff?text=Br" },
            { name: "CALABACÍN", imageUrl: "https://placehold.co/32x32/a21caf/ffffff?text=Ca" },
            { name: "CAMBUR GUINEO", imageUrl: "https://placehold.co/32x32/fde047/000000?text=CG" },
            { name: "CEBOLLA", imageUrl: "https://placehold.co/32x32/fb923c/ffffff?text=Ce" },
            { name: "CEBOLLA MORADA", imageUrl: "https://placehold.co/32x32/22c55e/ffffff?text=Ch" },
            { name: "CEBOLLÍN", imageUrl: "https://placehold.co/32x32/4ade80/ffffff?text=Cn" },
            { name: "CHAYOTA", imageUrl: "https://placehold.co/32x32/22c55e/ffffff?text=Ch" },
            { name: "CILANTRO", imageUrl: "https://placehold.co/32x32/22c55e/ffffff?text=Ch" },
            { name: "COLIFLOR", imageUrl: "https://placehold.co/32x32/22c55e/ffffff?text=Ch" },
            { name: "COCO", imageUrl: "https://placehold.co/32x32/22c55e/ffffff?text=Ch" },
            { name: "CURUBA", imageUrl: "https://placehold.co/32x32/22c55e/ffffff?text=Ch" },
            { name: "DURAZNO", imageUrl: "https://placehold.co/32x32/22c55e/ffffff?text=Ch" },
            { name: "ESPINADCA", imageUrl: "https://placehold.co/32x32/22c55e/ffffff?text=Ch" },
            { name: "FRESA", imageUrl: "https://placehold.co/32x32/22c55e/ffffff?text=Ch" },
            { name: "GUAYABA", imageUrl: "https://placehold.co/32x32/22c55e/ffffff?text=Ch" },
            { name: "JOJOTO", imageUrl: "https://placehold.co/32x32/22c55e/ffffff?text=Ch" },
            { name: "LECHOZA", imageUrl: "https://placehold.co/32x32/22c55e/ffffff?text=Ch" },
            { name: "LECHUGA AMERICANA", imageUrl: "https://placehold.co/32x32/22c55e/ffffff?text=Ch" },
            { name: "LECHUGA CRIOLLA", imageUrl: "https://placehold.co/32x32/22c55e/ffffff?text=Ch" },
            { name: "LECHUGA ROMANA", imageUrl: "https://placehold.co/32x32/22c55e/ffffff?text=Ch" },
            { name: "LIMON INGERTO", imageUrl: "https://placehold.co/32x32/22c55e/ffffff?text=Ch" },
            { name: "LIMON CRIOLLO", imageUrl: "https://placehold.co/32x32/22c55e/ffffff?text=Ch" },
            { name: "MANDARINA", imageUrl: "https://placehold.co/32x32/22c55e/ffffff?text=Ch" },
            { name: "MANGO", imageUrl: "https://placehold.co/32x32/22c55e/ffffff?text=Ch" },  
            { name: "NARANJA", imageUrl: "https://placehold.co/32x32/22c55e/ffffff?text=Ch" },
            { name: "HOJA DE HALLACA", imageUrl: "https://placehold.co/32x32/22c55e/ffffff?text=Ch" },
            { name: "MELON", imageUrl: "https://placehold.co/32x32/22c55e/ffffff?text=Ch" },
            { name: "NAME", imageUrl: "https://placehold.co/32x32/22c55e/ffffff?text=Ch" },
            { name: "NISPERO", imageUrl: "https://placehold.co/32x32/22c55e/ffffff?text=Ch" },
            { name: "OCUMO CHINO", imageUrl: "https://placehold.co/32x32/22c55e/ffffff?text=Ch" },
            { name: "OCUMO CRIOLLO", imageUrl: "https://placehold.co/32x32/22c55e/ffffff?text=Ch" },
            { name: "PAPA MF", imageUrl: "https://placehold.co/32x32/22c55e/ffffff?text=Ch" },
            { name: "PAPA FG", imageUrl: "https://placehold.co/32x32/22c55e/ffffff?text=Ch" },
            { name: "PATILLA", imageUrl: "https://placehold.co/32x32/22c55e/ffffff?text=Ch" },
            { name: "PEPINO", imageUrl: "https://placehold.co/32x32/22c55e/ffffff?text=Ch" },
            { name: "PEREJIL", imageUrl: "https://placehold.co/32x32/22c55e/ffffff?text=Ch" },
            { name: "PIMENTON GRANDE", imageUrl: "https://placehold.co/32x32/22c55e/ffffff?text=Ch" },
            { name: "PIMENTON MEDIANO", imageUrl: "https://placehold.co/32x32/22c55e/ffffff?text=Ch" },
            { name: "PIEMNTON GOLILLA", imageUrl: "https://placehold.co/32x32/22c55e/ffffff?text=Ch" },
            { name: "PIÑA", imageUrl: "https://placehold.co/32x32/22c55e/ffffff?text=Ch" },
            { name: "PALTANO GRANDE", imageUrl: "https://placehold.co/32x32/22c55e/ffffff?text=Ch" },
            { name: "PLATANO MEDIANO", imageUrl: "https://placehold.co/32x32/22c55e/ffffff?text=Ch" },
            { name: "PLATANO GOLILLA", imageUrl: "https://placehold.co/32x32/22c55e/ffffff?text=Ch" },
            { name: "REMOLACHA", imageUrl: "https://placehold.co/32x32/22c55e/ffffff?text=Ch" },
            { name: "REPOLLO BLANCO", imageUrl: "https://placehold.co/32x32/22c55e/ffffff?text=Ch" },
            { name: "REPOLLO MORADO", imageUrl: "https://placehold.co/32x32/22c55e/ffffff?text=Ch" },
            { name: "TOMATE GRANDE", imageUrl: "https://placehold.co/32x32/22c55e/ffffff?text=Ch" },
            { name: "TOMATE MEDIANO", imageUrl: "https://placehold.co/32x32/22c55e/ffffff?text=Ch" },
            { name: "TOMATE GOLILLA", imageUrl: "https://placehold.co/32x32/22c55e/ffffff?text=Ch" },
            { name: "TOPOCHO", imageUrl: "https://placehold.co/32x32/22c55e/ffffff?text=Ch" },
            { name: "VAINITA", imageUrl: "https://placehold.co/32x32/22c55e/ffffff?text=Ch" },
            { name: "YUCA", imageUrl: "https://placehold.co/32x32/22c55e/ffffff?text=Ch" },
        ];

        let customProducts = JSON.parse(localStorage.getItem(CUSTOM_PRODUCTS_KEY)) || [];
        let initialProductList = [...baseProductList, ...customProducts].sort((a, b) => a.name.localeCompare(b.name));
        
        let allProducts = initialProductList.map(p => ({
            ...p, 
            id: p.name.toUpperCase().replace(/\s/g, '_'), 
            total_desperdicio_kg: 0,
            registros: [] 
        })); 

        // DOM References
        const appHeader = document.getElementById('appHeader');
        const productListContainer = document.getElementById('productListContainer');
        const statusMessage = document.getElementById('statusMessage');
        const searchInput = document.getElementById('searchInput'); 
        const contextSubtitle = document.getElementById('contextSubtitle');
        const searchContainer = document.getElementById('searchContainer');
        const tableHeader = document.getElementById('tableHeader');
        const productHeaderCol = document.getElementById('productHeaderCol');
        const wasteHeaderCol = document.getElementById('wasteHeaderCol');
        
        const responsibleIndicator = document.getElementById('responsibleIndicator');
        const responsibleNameDisplay = document.getElementById('responsibleNameDisplay');
        const supplierIndicator = document.getElementById('supplierIndicator');
        const supplierNameDisplay = document.getElementById('supplierNameDisplay');

        const responsibleModal = document.getElementById('responsibleModal');
        const singleResponsibleInput = document.getElementById('singleResponsibleInput');
        
        const supplierNameModal = document.getElementById('supplierNameModal');
        const supplierNameInput = document.getElementById('supplierNameInput');
        const supplierSuggestions = document.getElementById('supplierSuggestions');

        const addProductModal = document.getElementById('addProductModal');
        const newProductNameInput = document.getElementById('newProductName');

        const hamburgerMenuButton = document.getElementById('hamburgerMenuButton');
        const hamburgerDropdown = document.getElementById('hamburgerDropdown');
        
        const inputModal = document.getElementById('inputModal');
        const distributionModal = document.getElementById('distributionModal');
        const distributionWeightDisplay = document.getElementById('distributionWeightDisplay'); 

        const modalTitle = document.getElementById('modalTitle');
        const desperdicioInput = document.getElementById('desperdicioInput');
        const desperdicioDisplay = document.getElementById('desperdicioDisplay');
        const modalProductId = document.getElementById('modalProductId');
        const modalProductName = document.getElementById('modalProductName');
        const modalProductImage = document.getElementById('modalProductImage');

        const confirmationModal = document.getElementById('confirmationModal');
        const deletePasswordInput = document.getElementById('deletePasswordInput');
        
        const editRecordModal = document.getElementById('editRecordModal');
        const editModalTitle = document.getElementById('editModalTitle');
        const editModalProductName = document.getElementById('editModalProductName');
        const editDesperdicioInput = document.getElementById('editDesperdicioInput');
        const editObservationInput = document.getElementById('editObservationInput'); 
        const editModalProductId = document.getElementById('editModalProductId');
        const editModalTimestamp = document.getElementById('editModalTimestamp');
        const editModalContextKey = document.getElementById('editModalContextKey');

        // REFERENCES FOR NEW MODALS
        const recognitionModal = document.getElementById('recognitionModal');
        const recognitionListContainer = document.getElementById('recognitionListContainer');
        const recognitionModalProductName = document.getElementById('recognitionModalProductName');
        const productGeneralNote = document.getElementById('productGeneralNote');
        const recognitionContextKey = document.getElementById('recognitionContextKey');
        const recognitionProductId = document.getElementById('recognitionProductId');

        const subtractModal = document.getElementById('subtractModal');
        const subtractAmountInput = document.getElementById('subtractAmountInput');
        const subtractLogTimestamp = document.getElementById('subtractLogTimestamp');
        const subtractProductId = document.getElementById('subtractProductId');
        const subtractContextKey = document.getElementById('subtractContextKey');
        const subtractMaxAmount = document.getElementById('subtractMaxAmount');
        
        const menuToggleButton = document.getElementById('menuToggleButton');
        const backButton = document.getElementById('backButton'); 
        const menuDropdown = document.getElementById('menuDropdown');
        const activeMenuItemText = document.getElementById('activeMenuItem');
        
        const menuSearchInput = document.getElementById('menuSearchInput'); 

        // Global Exports
        window.openModal = openModal;
        window.closeModal = closeModal;
        window.saveDesperdicio = saveDesperdicio;
        window.openDistributionModal = openDistributionModal;
        window.closeDistributionModal = closeDistributionModal;
        window.returnToCalculator = returnToCalculator; 
        window.finalizeWasteEntry = finalizeWasteEntry;
        window.openConfirmationModal = openConfirmationModal;
        window.closeConfirmationModal = closeConfirmationModal;
        window.confirmClearData = confirmClearData;
        window.handleTouchStart = handleTouchStart;
        window.handleTouchMove = handleTouchMove;
        window.handleTouchEnd = handleTouchEnd;
        window.openResponsibleModal = openResponsibleModal;
        window.closeResponsibleModal = closeResponsibleModal;
        window.saveResponsibleSelection = saveResponsibleSelection;
        window.openSupplierNameModal = openSupplierNameModal;
        window.closeSupplierNameModal = closeSupplierNameModal;
        window.saveSupplierName = saveSupplierName;
        window.shareContextToWhatsApp = shareContextToWhatsApp;
        window.exportToExcel = exportToExcel;
        window.openAddProductModal = openAddProductModal;
        window.closeAddProductModal = closeAddProductModal;
        window.addNewProduct = addNewProduct;
        window.openEditModal = openEditModal;
        window.closeEditModal = closeEditModal;
        window.saveRecordChanges = saveRecordChanges;
        window.deleteRecord = deleteRecord;
        window.exitStatsMode = exitStatsMode; 
        window.useSupplierSuggestion = useSupplierSuggestion;
        window.handleSupplierInput = handleSupplierInput; 
        
        window.openRecognitionModal = openRecognitionModal;
        window.closeRecognitionModal = closeRecognitionModal;
        window.saveNoteAndCloseRecognition = saveNoteAndCloseRecognition; 
        window.openSubtractModal = openSubtractModal;
        window.closeSubtractModal = closeSubtractModal;
        window.confirmSubtract = confirmSubtract;
        window.editRecordFromRecognition = editRecordFromRecognition; 
        
        // --- FUNCIÓN DE ACORDEÓN (DESPLIEGUE) ---
        window.toggleAccordion = function(id) {
            const content = document.getElementById(`content-${id}`);
            const icon = document.getElementById(`icon-${id}`);
            if (content.classList.contains('hidden')) {
                content.classList.remove('hidden');
                icon.classList.add('rotate-180');
            } else {
                content.classList.add('hidden');
                icon.classList.remove('rotate-180');
            }
        };

        // --- CALCULADORA ---
        class Calculator {
            constructor(inputElement, displayElement) {
                this.inputElement = inputElement;
                this.displayElement = displayElement;
                this.clear();
            }
            clear() {
                this.currentOperand = '0';
                this.previousOperand = '';
                this.operation = undefined;
                this.updateDisplay();
            }
            delete() {
                if (this.currentOperand === 'Error' || this.currentOperand === 'NaN' || this.currentOperand === 'Infinity') { this.clear(); return; }
                if (this.currentOperand.length > 1) { this.currentOperand = this.currentOperand.toString().slice(0, -1); } 
                else { this.currentOperand = '0'; }
                this.updateDisplay();
            }
            appendNumber(number) {
                if (number === '.' && this.currentOperand.includes('.')) return;
                if (this.currentOperand === '0' && number !== '.') { this.currentOperand = number.toString(); } 
                else if (this.currentOperand === 'Error' || this.currentOperand === 'NaN' || this.currentOperand === 'Infinity') { this.currentOperand = number.toString(); } 
                else { if (this.currentOperand.replace('.', '').length >= 10) return; this.currentOperand += number.toString(); }
                this.updateDisplay();
            }
            chooseOperation(operation) {
                if (this.currentOperand === '') return;
                if (this.previousOperand !== '') { this.compute(); }
                this.operation = operation;
                this.previousOperand = this.currentOperand;
                this.currentOperand = '0';
                this.updateDisplay();
            }
            compute() {
                let computation;
                const prev = parseFloat(this.previousOperand);
                const current = parseFloat(this.currentOperand);
                if (isNaN(prev) || isNaN(current)) return;
                switch (this.operation) {
                    case '+': computation = prev + current; break;
                    case '-': computation = prev - current; break;
                    case '×': computation = prev * current; break;
                    case '÷': if (current === 0) computation = 'Error'; else computation = prev / current; break;
                    default: return;
                }
                if (computation === 'Error' || isNaN(computation) || !isFinite(computation)) this.currentOperand = 'Error';
                else this.currentOperand = parseFloat(computation.toFixed(3)).toString();
                this.operation = undefined;
                this.previousOperand = '';
                this.updateDisplay();
            }
            getDisplayNumber(number) {
                const stringNumber = number.toString();
                const integerDigits = parseFloat(stringNumber.split('.')[0]);
                const decimalDigits = stringNumber.split('.')[1];
                let integerDisplay;
                if (isNaN(integerDigits)) integerDisplay = ''; else integerDisplay = integerDigits.toLocaleString('es-ES', { maximumFractionDigits: 0 });
                if (decimalDigits != null) return `${integerDisplay}.${decimalDigits}`; else return integerDisplay;
            }
            updateDisplay() {
                if (this.currentOperand === 'Error') { this.inputElement.value = 'Error de Cálculo'; this.displayElement.textContent = ''; } 
                else { this.inputElement.value = this.getDisplayNumber(this.currentOperand); }
                if (this.operation != null && this.previousOperand !== '') { this.displayElement.textContent = `${this.getDisplayNumber(this.previousOperand)} ${this.operation}`; } 
                else { this.displayElement.textContent = ''; }
            }
        }
        const calculator = new Calculator(desperdicioInput, desperdicioDisplay);
        window.calculator = calculator;

        // --- SWIPE & NAVIGATION (MOBILE & PC) ---
        let isMouseDown = false;

        function handleTouchStart(event) {
            isSwiping = false; 
            touchStartX = event.touches ? event.touches[0].clientX : event.clientX;
            touchEndX = touchStartX;
            menuToggleButton.classList.remove('swiping-left', 'swiping-right');
        }
        
        function handleTouchMove(event) {
            if (event.type === 'mousemove' && !isMouseDown) return;
            touchEndX = event.touches ? event.touches[0].clientX : event.clientX;
            const diff = touchStartX - touchEndX;
            if (Math.abs(diff) > 5) {
                isSwiping = true;
                menuDropdown.classList.add('hidden');
                if (diff > 0) { menuToggleButton.classList.add('swiping-left'); menuToggleButton.classList.remove('swiping-right'); } 
                else { menuToggleButton.classList.add('swiping-right'); menuToggleButton.classList.remove('swiping-left'); }
            }
        }
        
        function handleTouchEnd(event) {
            menuToggleButton.classList.remove('swiping-left', 'swiping-right');
            
            if (!isSwiping) { 
                return; // Espera al evento click natural
            }
            
            const diff = touchStartX - touchEndX; 
            if (Math.abs(diff) > SWIPE_THRESHOLD) {
                let direction = diff > 0 ? 'left' : 'right';
                changeContextBySwipe(direction);
            } else { 
                toggleDropdown(); 
            }
            
            setTimeout(() => { isSwiping = false; }, 50);
        }

        // Asignar eventos de drag para PC (Mouse)
        menuToggleButton.addEventListener('mousedown', (e) => {
            isMouseDown = true;
            handleTouchStart(e);
        });
        menuToggleButton.addEventListener('mousemove', (e) => {
            handleTouchMove(e);
        });
        const endMouseDrag = (e) => {
            if (isMouseDown) {
                isMouseDown = false;
                handleTouchEnd(e);
            }
        };
        menuToggleButton.addEventListener('mouseup', endMouseDrag);
        menuToggleButton.addEventListener('mouseleave', endMouseDrag);
        function changeContextBySwipe(direction) {
            const currentActiveKeyBase = activeMenuItemText.textContent.split(':')[0].trim(); 
            let currentIndex = -1;
            
            for (let i = 0; i < contextKeys.length; i++) {
                if (contextKeys[i] === currentActiveKeyBase || currentActiveKeyBase.includes("PROVEEDOR")) {
                    currentIndex = i;
                    if (currentActiveKeyBase.includes("PROVEEDOR") && contextKeys[i] === "PROVEEDOR") break;
                    if (contextKeys[i] === currentActiveKeyBase) break;
                }
            }

            if (currentIndex === -1) currentIndex = 0;
            let newIndex = currentIndex;
            if (direction === 'left') { newIndex = (currentIndex + 1) % contextKeys.length; } 
            else if (direction === 'right') { newIndex = (currentIndex - 1 + contextKeys.length) % contextKeys.length; }
            const newKey = contextKeys[newIndex];
            const newBtn = document.querySelector(`button[data-key="${newKey}"]`);
            if (newBtn) {
                selectMenuItem({ target: newBtn });
            }
        }

        // --- LOCAL STORAGE ---
        function loadLocalStore() {
            try {
                const json = localStorage.getItem(LOCAL_STORAGE_KEY);
                return json ? JSON.parse(json) : {};
            } catch (e) { return {}; }
        }
        function saveContextData(context, contextData) {
            const store = loadLocalStore();
            store[context] = contextData;
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(store));
        }
        function updateProductStateFromLocalData() {
            if (!dataContext) {
                allProducts = initialProductList.map(product => {
                    const productId = product.name.toUpperCase().replace(/\s/g, '_');
                    return { ...product, id: productId, total_desperdicio_kg: 0, registros: [] };
                });
                return;
            }
            allProducts = initialProductList.map(product => {
                const productId = product.name.toUpperCase().replace(/\s/g, '_');
                const productLogs = currentContextData[productId] || [];
                const totalKg = productLogs.reduce((sum, log) => {
                    const obs = (log.observation || '').toUpperCase();
                    if (obs.includes('RC') || obs.includes('RECONOCER')) return sum;
                    return sum + (log.desperdicio_kg || 0);
                }, 0);
                return { ...product, id: productId, total_desperdicio_kg: totalKg, registros: productLogs.sort((a, b) => b.timestamp - a.timestamp) };
            });
        }
        let tempOverrideContext = null;
        let tempOverrideIsProvider = false;
        let tempOverrideProviderName = null;

        window.openModalInStats = function(productId, contextKey, isProvider) {
             tempOverrideContext = contextKey;
             tempOverrideIsProvider = isProvider;
             tempOverrideProviderName = isProvider ? contextKey : null; 
             const prod = allProducts.find(p => p.id === productId);
             if (prod) openModal(prod, true); 
        };

        function logNewWaste(productName, productNameId, newKg, distribution) { 
            const numericKg = parseFloat(newKg);
            if (isNaN(numericKg) || numericKg <= 0) return;

            let targetContextDbKey = dataContext;
            let entrySupplier = null;

            if (viewMode === 'stats' && tempOverrideContext) {
                 if (tempOverrideIsProvider) {
                     targetContextDbKey = contextMap["PROVEEDOR"];
                     entrySupplier = tempOverrideProviderName || "DESCONOCIDO";
                 } else {
                     targetContextDbKey = contextMap[tempOverrideContext];
                 }
            } else {
                 if (dataContext === contextMap["PROVEEDOR"]) {
                     entrySupplier = currentSupplier || "DESCONOCIDO";
                 }
            }

            let entryResponsible = currentResponsible;
            
            const newEntry = { 
                desperdicio_kg: numericKg,
                timestamp: Date.now(),
                responsible: entryResponsible,
                supplier: entrySupplier, 
                observation: `Destino: ${distribution}` 
            };

            const store = loadLocalStore();
            let targetData = store[targetContextDbKey] || {};
            
            if (!targetData[productNameId]) targetData[productNameId] = [];
            targetData[productNameId].unshift(newEntry);
            
            store[targetContextDbKey] = targetData;
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(store));

            // Sincronizar memoria activa
            if (targetContextDbKey === dataContext) {
                currentContextData = targetData;
            }

            if (viewMode === 'stats') {
                updateUI();
            } else {
                updateProductStateFromLocalData();
                updateUI();
            }
        }

        // --- RESPONSABLE (SINGLE) ---
        function updateResponsibleUI() {
            if (currentResponsible && currentResponsible !== 'SIN ASIGNAR') {
                responsibleNameDisplay.textContent = currentResponsible;
                responsibleIndicator.classList.remove('hidden');
            } else {
                responsibleNameDisplay.textContent = "--";
                responsibleIndicator.classList.add('hidden');
            }
        }

        function openResponsibleModal() {
            hamburgerDropdown.classList.add('hidden'); 
            singleResponsibleInput.value = currentResponsible === 'SIN ASIGNAR' || currentResponsible.startsWith("PROV:") ? '' : currentResponsible;
            responsibleModal.classList.remove('hidden');
            singleResponsibleInput.focus();
        }

        function closeResponsibleModal(event) {
             if (event && event.target.id !== 'responsibleModal') return;
             responsibleModal.classList.add('hidden');
        }

        function saveResponsibleSelection() {
            const name = singleResponsibleInput.value.trim().toUpperCase();
            currentResponsible = name || 'SIN ASIGNAR';
            localStorage.setItem(RESPONSIBLE_SELECTED_KEY, currentResponsible);
            updateResponsibleUI();
            closeResponsibleModal();
        }

        // --- LOGICA DE PROVEEDOR (Supplier Name) ---

        function renderSupplierSuggestions(filterText = '') {
            if (supplierSuggestions) {
                supplierSuggestions.innerHTML = '';
            }
            return; // Deshabilitado a petición del usuario
        }

        function handleSupplierInput(val) {
            renderSupplierSuggestions(val);
        }

        function openSupplierNameModal() {
            supplierNameInput.value = '';
            renderSupplierSuggestions(''); 
            supplierNameModal.classList.remove('hidden');
            supplierNameInput.focus();
        }
        
        function useSupplierSuggestion(name) {
            supplierNameInput.value = name;
        }

        function closeSupplierNameModal(event) {
            if (event && event.target.id !== 'supplierNameModal') return;
            supplierNameModal.classList.add('hidden');
        }

        function saveSupplierName() {
            const name = supplierNameInput.value.trim().toUpperCase();
            if (name) {
                currentSupplier = name;
                
                const index = savedSuppliers.indexOf(name);
                if (index > -1) {
                    savedSuppliers.splice(index, 1);
                }
                savedSuppliers.unshift(name); 
                localStorage.setItem(SUPPLIERS_LIST_KEY, JSON.stringify(savedSuppliers));

                if (supplierNameDisplay) {
                    supplierNameDisplay.textContent = name;
                }
                
                renderDropdownSuppliers();
                closeSupplierNameModal();
                activateContext("PROVEEDOR", `PROVEEDOR: ${name}`); 
            } else {
                showToast("Debe ingresar un nombre.", "error");
            }
        }

        function renderDropdownSuppliers() {
            const container = document.getElementById('dropdownSuppliersContainer');
            if (!container) return;
            container.innerHTML = '';
            
            savedSuppliers.forEach(name => {
                const btn = document.createElement('button');
                btn.className = "menu-item w-full text-left py-3 px-4 text-sm font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 border-b border-purple-100 flex items-center pl-8";
                btn.setAttribute('data-key', 'PROVEEDOR_SAVED');
                btn.setAttribute('data-supplier', name);
                
                btn.innerHTML = `
                    <svg class="w-4 h-4 mr-2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                    PROVEEDOR: ${name}
                `;
                
                btn.addEventListener('click', selectMenuItem);
                container.appendChild(btn);
            });
        }


        // --- WHATSAPP SHARING (VERSION REPORTE INTELIGENTE) ---
        function getDestAbbr(obs) {
            if (!obs) return '';
            const u = obs.toUpperCase();
            if (u.includes('RC') || u.includes('RECONOCER')) {
                if (u.includes('-MF')) return 'RC-MF';
                if (u.includes('-FG')) return 'RC-FG';
                if (u.includes('-F')) return 'RC-F';
                return 'RC';
            }
            if (u.includes('MINI FERIA')) return 'MF';
            if (u.includes('FERIA GRANDE')) return 'FG';
            if (u.includes('FRUTERIA') || u.includes('FRUTERÍA')) return 'F';
            return 'OTRO';
        }

        // Nueva función para formatear hora 12H
        function formatTime12h(timestamp) {
            if (!timestamp) return '--:--';
            const date = new Date(timestamp);
            let hours = date.getHours();
            const minutes = date.getMinutes();
            const ampm = hours >= 12 ? 'PM' : 'AM';
            hours = hours % 12;
            hours = hours ? hours : 12; 
            const strMinutes = minutes < 10 ? '0' + minutes : minutes;
            return hours + ':' + strMinutes + ampm;
        }

        function formatProductLine(productName, productId, contextKey, logs) {
            let totalKg = 0;
            let totalFG = 0;
            let totalMF = 0;
            let totalF = 0;
            let totalRC = 0; 

            logs.forEach(log => {
                const kg = log.desperdicio_kg;
                const obs = (log.observation || '').toUpperCase();
                
                if (obs.includes('RC') || obs.includes('RECONOCER')) {
                    totalRC += kg;
                } else {
                    totalKg += kg;
                    if (obs.includes('FERIA GRANDE')) {
                        totalFG += kg;
                    } else if (obs.includes('MINI FERIA')) {
                        totalMF += kg;
                    } else if (obs.includes('FRUTERIA') || obs.includes('FRUTERÍA')) {
                        totalF += kg;
                    }
                }
            });
            
            const breakdown = logs.map(log => {
                const kg = (log.desperdicio_kg % 1 === 0) ? log.desperdicio_kg : log.desperdicio_kg.toFixed(2);
                let abbr = getDestAbbr(log.observation);
                
                let cleanObs = log.observation || '';
                cleanObs = cleanObs.replace(/Destino:\s*/i, '');
                cleanObs = cleanObs.replace(/MINI FERIA/i, '')
                                   .replace(/FERIA GRANDE/i, '')
                                   .replace(/FRUTERIA/i, '')
                                   .replace(/FRUTERÍA/i, '')
                                   .replace(/RECONOCER/i, '')
                                   .replace(/RC-MF/i, '')
                                   .replace(/RC-FG/i, '')
                                   .replace(/RC-F/i, '')
                                   .replace(/RC/i, '');
                cleanObs = cleanObs.replace(/^[.\-\s]+/, '').trim();

                if (cleanObs) {
                    abbr += `-${cleanObs}`;
                }

                return `${kg}(${abbr})`;
            }).join(' + ');

            const totalKgStr = (totalKg % 1 === 0) ? totalKg : totalKg.toFixed(2);
            
            // Construcción de Línea de Totales con separador "/"
            let totalsParts = [];
            if (totalFG > 0) totalsParts.push(`TOTAL FG: ${(totalFG % 1 === 0) ? totalFG : totalFG.toFixed(2)}`);
            if (totalMF > 0) totalsParts.push(`TOTAL MF: ${(totalMF % 1 === 0) ? totalMF : totalMF.toFixed(2)}`);
            if (totalF > 0) totalsParts.push(`TOTAL F: ${(totalF % 1 === 0) ? totalF : totalF.toFixed(2)}`);
            if (totalRC > 0) totalsParts.push(`TOTAL RC: ${(totalRC % 1 === 0) ? totalRC : totalRC.toFixed(2)}`);
            
            const totalLine = totalsParts.join(' / ');
            
            let result = `📦 ${productName}: ${totalKgStr} KG\n`;
            if (totalLine) result += `${totalLine}\n`;
            result += `[${breakdown}]`;
            
            // BUSCAR OBSERVACIÓN GENERAL (NOTA DE RECONOCIMIENTO)
            const uniqueKey = contextKey + '_' + productId;
            const note = productNotes[uniqueKey];
            
            if (note) {
                result += `\n🚨OBSERVACION🚨\n${note}`;
            }
            
            return result;
        }

        function shareContextToWhatsApp() {
            hamburgerDropdown.classList.add('hidden');
            const dateObj = new Date();
            const dateStr = dateObj.toLocaleDateString('es-VE');
            const store = loadLocalStore();
            const contextsToReport = contextKeys; 

            let message = `REPORTE DE RECEPCIÓN 🗓\n${dateStr}\n`;
            message += `👤 Resp: ${currentResponsible}\n`;
            message += `___________________\n\n`; 

            let hasAnyData = false;

            contextsToReport.forEach(cKey => {
                const dbKey = contextMap[cKey];
                const contextData = store[dbKey] || {};
                
                if (cKey === "PROVEEDOR") {
                    const providerGroups = {};
                    initialProductList.forEach(prod => {
                        const pId = prod.name.toUpperCase().replace(/\s/g, '_');
                        const logs = contextData[pId] || [];
                        if (logs.length > 0) {
                            logs.forEach(log => {
                                let sName = log.supplier || (log.responsible && log.responsible.startsWith("PROV:") ? log.responsible.replace("PROV:", "").trim() : "DESCONOCIDO");
                                if (!sName) sName = "DESCONOCIDO";
                                if (!providerGroups[sName]) providerGroups[sName] = [];
                                providerGroups[sName].push({ productName: prod.name, productId: pId, ...log });
                            });
                        }
                    });

                    for (const [provName, items] of Object.entries(providerGroups)) {
                        // Calcular HORA (Último registro) para mostrar en cabecera
                        let maxTime = 0;
                        items.forEach(i => { if(i.timestamp > maxTime) maxTime = i.timestamp; });
                        const timeStr = formatTime12h(maxTime);

                        message += `🚛 PROVEEDOR: ${provName} / HORA:${timeStr} 🕛\n`;
                        
                        const productsInProv = {};
                        items.forEach(item => {
                            if (!productsInProv[item.productId]) productsInProv[item.productId] = { name: item.productName, logs: [] };
                            productsInProv[item.productId].logs.push(item);
                        });

                        for (const [pId, pData] of Object.entries(productsInProv)) {
                            message += formatProductLine(pData.name, pId, provName, pData.logs) + "\n\n";
                        }
                        
                        message += `___________________\n\n`; 
                        hasAnyData = true;
                    }

                } else {
                    let contextContent = "";
                    let maxTime = 0;
                    
                    initialProductList.forEach(prod => {
                        const pId = prod.name.toUpperCase().replace(/\s/g, '_');
                        const logs = contextData[pId] || [];
                        if (logs.length > 0) {
                            logs.forEach(l => { if(l.timestamp > maxTime) maxTime = l.timestamp; });
                            contextContent += formatProductLine(prod.name, pId, cKey, logs) + "\n\n";
                        }
                    });

                    if (contextContent !== "") {
                        const timeStr = formatTime12h(maxTime);
                        message += `📍 ${cKey} / HORA:${timeStr} 🕛\n`;
                        message += contextContent;
                        message += `___________________\n\n`; 
                        hasAnyData = true;
                    }
                }
            });

            if (!hasAnyData) {
                showToast("No hay datos para generar el reporte.", "warning");
                return;
            }

            const encodedMessage = encodeURIComponent(message);
            window.open(`https://wa.me/?text=${encodedMessage}`, '_blank');
        }

        // --- EXCEL EXPORT (BACKUP) ---
        function exportToExcel() {
            hamburgerDropdown.classList.add('hidden'); 
            if (typeof XLSX === 'undefined') { showToast("Error: Librería Excel no cargada.", "error"); return; }
            const store = loadLocalStore();
            const wb = XLSX.utils.book_new();
            
            contextKeys.forEach(key => {
                const dbKey = contextMap[key]; 
                const contextData = store[dbKey] || {};
                
                let sheetData;
                
                if (key === "PROVEEDOR") {
                    sheetData = generateProviderStackedSheet(contextData);
                } else {
                    sheetData = generateSheetDataForContext(key, contextData);
                }
                
                const ws = XLSX.utils.aoa_to_sheet(sheetData);
                const wscols = [];
                for(let i=0; i<20; i++) wscols.push({wch: 12});
                wscols[0] = {wch: 25}; 
                ws['!cols'] = wscols; 
                XLSX.utils.book_append_sheet(wb, ws, key); 
            });
            
            const dateObj = new Date();
            const dayName = dateObj.toLocaleDateString('es-VE', { weekday: 'long' }).toUpperCase();
            const dateStr = dateObj.toISOString().slice(0,10);
            const fileName = `REPORTE_RECEPCIÓN_${dayName}_${dateStr}.xlsx`;
            XLSX.writeFile(wb, fileName);
        }

        function generateProviderStackedSheet(contextData) {
            return generateSheetDataForContext("PROVEEDOR", contextData); 
        }

        function generateSheetDataForContext(contextName, contextData) {
            const dateObj = new Date();
            const dateStr = dateObj.toLocaleDateString('es-VE');
            
            let maxEntries = 0;
            const processedRows = initialProductList.map(prod => {
                const productId = prod.name.toUpperCase().replace(/\s/g, '_');
                const logs = contextData[productId] || [];
                const sortedLogs = [...logs].sort((a, b) => a.timestamp - b.timestamp); 
                if (sortedLogs.length > maxEntries) maxEntries = sortedLogs.length;
                return { name: prod.name, logs: sortedLogs, total: sortedLogs.reduce((sum, l) => {
                    const obs = (l.observation || '').toUpperCase();
                    if (obs.includes('RC') || obs.includes('RECONOCER')) return sum;
                    return sum + l.desperdicio_kg;
                }, 0) };
            });
            if (maxEntries === 0) maxEntries = 1;

            const wsData = [];
            wsData.push([`DESPERDICIO ${contextName}`]);
            wsData.push([`FECHA: ${dateStr}`]);
            wsData.push([`RESPONSABLE:`, currentResponsible]);
            wsData.push([]);

            const headerRow = ["PRODUCTOS"];
            for (let i = 1; i <= maxEntries; i++) headerRow.push(`PESA N°${i}`);
            headerRow.push("TOTAL");
            for (let i = 1; i <= maxEntries; i++) headerRow.push(`DESTINO N°${i}`);
            wsData.push(headerRow);

            let grandTotal = 0;
            processedRows.forEach(row => {
                const rowData = [row.name];
                for (let i = 0; i < maxEntries; i++) {
                    if (row.logs[i]) rowData.push(row.logs[i].desperdicio_kg); else rowData.push("");
                }
                rowData.push(row.total);
                grandTotal += row.total;
                for (let i = 0; i < maxEntries; i++) {
                    if (row.logs[i]) {
                        let obs = row.logs[i].observation.replace('Destino: ', '');
                        if (row.logs[i].supplier) {
                            obs += ` [Prov: ${row.logs[i].supplier}]`;
                        }
                        rowData.push(obs);
                    } else rowData.push("");
                }
                wsData.push(rowData);
            });
            return wsData;
        }

        // --- UI LOGIC ---
        const menuItems = document.querySelectorAll('.menu-item');
        
        function toggleDropdown() {
            if (!isSwiping) {
                menuDropdown.classList.toggle('hidden');
                hamburgerDropdown.classList.add('hidden');
                
                if (!menuDropdown.classList.contains('hidden')) {
                    if(menuSearchInput) {
                        menuSearchInput.value = ''; 
                        // menuSearchInput.focus(); // Eliminado a petición del usuario para evitar teclado emergente en móviles
                        filterMenuLocations(''); 
                    }
                    menuDropdown.scrollTop = 0; // Asegurar que siempre empiece desde arriba
                }
            }
        }
        function toggleHamburgerDropdown() {
            hamburgerDropdown.classList.toggle('hidden');
            menuDropdown.classList.add('hidden');
        }
        hamburgerMenuButton.addEventListener('click', (event) => { event.stopPropagation(); toggleHamburgerDropdown(); });
        menuToggleButton.addEventListener('click', (event) => { event.stopPropagation(); toggleDropdown(); });

        function filterMenuLocations(filterText) {
            const cleanFilter = filterText.toUpperCase().trim();
            const menuButtons = menuDropdown.querySelectorAll('.menu-item');
            
            menuButtons.forEach(btn => {
                const txt = btn.textContent || btn.innerText;
                if(txt.toUpperCase().includes(cleanFilter)) {
                    btn.classList.remove('hidden');
                } else {
                    btn.classList.add('hidden');
                }
            });
            const deleteBtn = document.querySelector('.filterable-action');
            if(deleteBtn) {
                const txt = deleteBtn.textContent || deleteBtn.innerText;
                if(txt.toUpperCase().includes(cleanFilter)) {
                    deleteBtn.classList.remove('hidden');
                    deleteBtn.parentElement.classList.remove('hidden');
                } else {
                    deleteBtn.classList.add('hidden');
                    deleteBtn.parentElement.classList.add('hidden');
                }
            }
        }

        if(menuSearchInput) {
            menuSearchInput.addEventListener('input', (e) => {
                filterMenuLocations(e.target.value);
            });
            menuSearchInput.addEventListener('click', (e) => {
                e.stopPropagation();
            });
        }

        function changeDataContext(newDataContext) {
            dataContext = newDataContext; 
            localWasteStore = loadLocalStore();
            currentContextData = localWasteStore[dataContext] || {};
            updateProductStateFromLocalData();
            statusMessage.classList.add('hidden'); 
            updateUI(); 
        }
        
        function activateContext(selectedKey, selectedText) {
            // --- ACTUALIZAMOS MEMORIA DE SELECCIÓN ---
            currentActiveKey = selectedKey;
            currentActiveLabel = selectedText;
            
            // Persistir selección
            localStorage.setItem(ACTIVE_KEY_STORAGE, selectedKey);
            localStorage.setItem(ACTIVE_LABEL_STORAGE, selectedText);
            if (selectedKey === "PROVEEDOR" && currentSupplier) {
                localStorage.setItem(ACTIVE_SUPPLIER_STORAGE, currentSupplier);
            }
            
            // Limpiamos el rastro de la última edición para no afectar la navegación
            lastEditedGroupContext = null;

            activeMenuItemText.textContent = selectedText;
            viewMode = 'entry';
            let newDataContext = contextMap[selectedKey];
            
            if (selectedKey === "PROVEEDOR") {
                // Si el label ya contiene el nombre (ej: "PROVEEDOR: JUAN"), lo respetamos
                if (selectedText.includes("RECEPCIÓN PROVEEDOR") && currentSupplier) {
                     // Si es el click inicial del menú y ya hay un proveedor guardado
                     if (contextSubtitle) contextSubtitle.textContent = `PROVEEDOR: ${currentSupplier}`;
                     activeMenuItemText.textContent = `PROVEEDOR: ${currentSupplier}`; 
                     currentActiveLabel = `PROVEEDOR: ${currentSupplier}`; // Actualizar label en memoria
                } else {
                     if (contextSubtitle) contextSubtitle.textContent = selectedText; 
                     activeMenuItemText.textContent = selectedText; 
                }
                if (supplierIndicator) supplierIndicator.classList.remove('hidden'); 
            } else {
                if (contextSubtitle) contextSubtitle.textContent = `${selectedText} - Registro Activo`;
                if (supplierIndicator) supplierIndicator.classList.add('hidden'); 
            }

            searchContainer.classList.remove('hidden');
            searchInput.value = '';
            
            menuToggleButton.classList.remove('hidden');
            backButton.classList.add('hidden');

            if (newDataContext && newDataContext !== dataContext) {
                 changeDataContext(newDataContext);
            } else {
                updateUI();
            }
            menuDropdown.classList.add('hidden');
            
            document.querySelectorAll('.menu-item').forEach(btn => {
                btn.classList.remove('bg-indigo-100', 'text-indigo-800', 'bg-purple-100', 'text-purple-800');
                btn.classList.add('text-gray-700');

                if(btn.getAttribute('data-key') === selectedKey) {
                    btn.classList.remove('text-gray-700');
                    if(selectedKey === 'PROVEEDOR') {
                        btn.classList.add('bg-purple-100', 'text-purple-800');
                    } else {
                        btn.classList.add('bg-indigo-100', 'text-indigo-800');
                    }
                }
            });
        }

        // --- CAMBIO CLAVE: VOLVER INTELIGENTE ---
        function exitStatsMode() {
            // Usamos las variables guardadas para restaurar el estado exacto
            lastEditedGroupContext = null; // Limpiar al salir del modo stats
            activateContext(currentActiveKey, currentActiveLabel);
        }

        function selectMenuItem(event) {
            const target = event.target.closest('.menu-item') || event.target;
            const selectedKey = target.getAttribute('data-key');
            if (!selectedKey) return; 
            
            if (selectedKey === 'STATS_VIEW') {
                viewMode = 'stats';
                if (contextSubtitle) contextSubtitle.textContent = `ESTADÍSTICA`; 
                if (supplierIndicator) supplierIndicator.classList.add('hidden');
                
                searchContainer.classList.remove('hidden');
                searchInput.value = ''; 
                searchInput.placeholder = "Buscar producto, sede o proveedor...";
                
                menuToggleButton.classList.add('hidden');
                backButton.classList.remove('hidden');

                updateUI();
                menuDropdown.classList.add('hidden');
                hamburgerDropdown.classList.add('hidden'); // CIERRA EL MENU HAMBURGUESA
                return;
            } else {
                searchInput.placeholder = "Buscar productos...";
            }

            if (selectedKey === 'PROVEEDOR') {
                menuDropdown.classList.add('hidden');
                openSupplierNameModal();
                return;
            }

            if (selectedKey === 'PROVEEDOR_SAVED') {
                currentSupplier = target.getAttribute('data-supplier');
                localStorage.setItem(ACTIVE_SUPPLIER_STORAGE, currentSupplier); // Guardar proveedor específico
                menuDropdown.classList.add('hidden');
                activateContext("PROVEEDOR", `PROVEEDOR: ${currentSupplier}`);
                return;
            }

            activateContext(selectedKey, target.textContent);
        }
        
        menuItems.forEach(item => item.addEventListener('click', selectMenuItem));
        document.addEventListener('click', (event) => {
            if (!menuToggleButton.contains(event.target) && !menuDropdown.contains(event.target) && !confirmationModal.contains(event.target) && !recognitionModal.contains(event.target) && !subtractModal.contains(event.target)) menuDropdown.classList.add('hidden');
            if (!hamburgerMenuButton.contains(event.target) && !hamburgerDropdown.contains(event.target)) hamburgerDropdown.classList.add('hidden');
        });

        // --- MODALS LOGIC (FLOW) ---
        function openModal(product, forceAllowInStats = false) {
            if (!dataContext && viewMode !== 'stats') {
                showToast("Debe seleccionar un grupo o proveedor para comenzar.", "error");
                return;
            }
            if (viewMode === 'stats' && !forceAllowInStats) {
                return; // En stats no hacemos nada aquí por defecto, salvo que sea forceAllowInStats
            }
            modalTitle.textContent = product.name; 
            modalProductId.value = product.id; 
            modalProductName.value = product.name; 
            calculator.clear(); 
            let imageUrl = product.imageUrl;
            if (!imageUrl || imageUrl === DEFAULT_IMAGE_URL) { imageUrl = 'https://placehold.co/120x120/7e22ce/ffffff?text=P'; }
            modalProductImage.src = imageUrl;
            modalProductImage.onerror = () => { modalProductImage.src = 'https://placehold.co/120x120/7e22ce/ffffff?text=P'; };
            inputModal.classList.remove('hidden');
        }
        
        function closeModal(event) {
            if (event && event.target.id !== 'inputModal' && event.target.id !== 'inputModal') return;
            inputModal.classList.add('hidden');
            desperdicioInput.value = '';
            desperdicioDisplay.textContent = '';
        }

        function openDistributionModal() {
            distributionModal.classList.remove('hidden');
        }

        function closeDistributionModal(event) {
            if (event && event.target.id !== 'distributionModal') return;
            distributionModal.classList.add('hidden');
        }

        function saveDesperdicio() {
            if (calculator.operation && calculator.previousOperand !== '') { calculator.compute(); }
            const finalValueString = desperdicioInput.value.replace(/,/g, ''); 
            if (finalValueString === 'Error de Cálculo') return;
            let finalValue = parseFloat(finalValueString); 
            if (isNaN(finalValue) || finalValue === 0) { closeModal(); return; }
            
            tempProductId = modalProductId.value;
            tempProductName = modalProductName.value;
            tempWeight = Math.abs(finalValue);
            
            const displayWeight = (tempWeight % 1 === 0) ? tempWeight : tempWeight.toFixed(2);
            distributionWeightDisplay.textContent = `TOTAL: ${displayWeight} KG`;

            closeModal();
            openDistributionModal(); 
        }

        function returnToCalculator() {
            distributionModal.classList.add('hidden');
            const originalProduct = allProducts.find(p => p.id === tempProductId);
            if (originalProduct) {
                openModal(originalProduct);
                const weightStr = tempWeight.toString();
                calculator.currentOperand = weightStr;
                calculator.updateDisplay();
            }
        }

        function finalizeWasteEntry(distribution) {
            logNewWaste(tempProductName, tempProductId, tempWeight, distribution);
            closeDistributionModal();
        }

        // --- NEW RECOGNITION LOGIC ---

        function openRecognitionModal(productName, productId, contextKey, encodedLogs) {
            const logs = JSON.parse(decodeURIComponent(encodedLogs));
            recognitionModalProductName.textContent = productName;
            recognitionListContainer.innerHTML = '';
            
            // Set context for saving notes
            recognitionContextKey.value = contextKey;
            recognitionProductId.value = productId;

            // Load existing note
            const uniqueKey = contextKey + '_' + productId;
            productGeneralNote.value = productNotes[uniqueKey] || '';

            // Invertir el orden para que empiece de la primera (más antigua) hacia abajo
            const reversedLogs = [...logs].reverse();
            
            // 1. Asignar prefijos y grupos
            let currentPiece = 1;
            reversedLogs.forEach(log => {
                const obs = (log.observation || '').toUpperCase();
                log.isRC = obs.includes("RC") || obs.includes("RECONOCER");
                
                if (!log.isRC) {
                    log.piecePrefix = `P#${String(currentPiece).padStart(2, '0')} • `;
                    currentPiece++;
                } else {
                    log.piecePrefix = '';
                }
                
                if (obs.includes('FERIA GRANDE') || obs.includes('-FG')) log.destGroup = 'FG';
                else if (obs.includes('MINI FERIA') || obs.includes('-MF')) log.destGroup = 'MF';
                else if (obs.includes('FRUTERIA') || obs.includes('FRUTERÍA') || obs.includes('-F')) log.destGroup = 'F';
                else log.destGroup = 'OTHER';
            });

            // 2. Reordenar: colocar cada RC justo después de la última Pesa de su mismo grupo
            const reorderedLogs = [];
            const pesas = reversedLogs.filter(l => !l.isRC);
            const rcs = reversedLogs.filter(l => l.isRC);

            pesas.forEach(pesa => reorderedLogs.push(pesa));

            rcs.forEach(rc => {
                let insertIdx = -1;
                for (let i = reorderedLogs.length - 1; i >= 0; i--) {
                    if (!reorderedLogs[i].isRC && reorderedLogs[i].destGroup === rc.destGroup) {
                        insertIdx = i;
                        break;
                    }
                }
                if (insertIdx !== -1) {
                    // Para que si hay múltiples RCs del mismo grupo queden en orden cronológico debajo de la pesa
                    let finalIdx = insertIdx + 1;
                    while(finalIdx < reorderedLogs.length && reorderedLogs[finalIdx].isRC && reorderedLogs[finalIdx].destGroup === rc.destGroup) {
                        finalIdx++;
                    }
                    reorderedLogs.splice(finalIdx, 0, rc);
                } else {
                    reorderedLogs.push(rc);
                }
            });

            // 3. Renderizar
            reorderedLogs.forEach((log, index) => {
                const logTime = new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                const kg = (log.desperdicio_kg % 1 === 0) ? log.desperdicio_kg : log.desperdicio_kg.toFixed(2);
                const obs = log.observation.replace("Destino: ", "");
                
                const isRC = log.isRC;
                const piecePrefix = log.piecePrefix;

                const row = document.createElement('div');
                row.className = `flex justify-between items-center ${isRC ? 'bg-orange-50' : 'bg-gray-50'} border border-gray-200 rounded p-1.5 text-sm relative`;
                
                const editAction = `editRecordFromRecognition('${productId}', ${log.timestamp}, ${log.desperdicio_kg}, '${productName.replace(/'/g, "\\'")}', '${contextKey}')`;
                const editBtnHtml = `
                    <button onclick="${editAction}" class="absolute top-1 right-1 p-1 text-gray-400 hover:text-indigo-600 hover:bg-gray-100 rounded-full" title="Editar Cantidad">
                        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                    </button>
                `;

                let btnHtml = '';
                if (!isRC) {
                    btnHtml = `
                        <button onclick="openSubtractModal(${log.timestamp}, '${productId}', '${contextKey}', ${log.desperdicio_kg})" 
                            class="bg-indigo-600 text-white font-bold text-[10px] px-2 py-1 rounded hover:bg-indigo-700 uppercase tracking-wide mt-0.5">
                            RECONOCER
                        </button>
                    `;
                } else {
                    btnHtml = `<span class="text-[10px] font-bold text-orange-500 uppercase border border-orange-200 bg-orange-50 px-2 py-1 rounded mt-0.5 inline-block">RECONOCIDO</span>`;
                }

                let obsBadgeClass = isRC ? 'bg-orange-500 text-white' : 'bg-indigo-600 text-white';

                row.innerHTML = `
                    ${editBtnHtml}
                    <div class="flex flex-col pr-6 leading-tight w-full">
                        <div class="flex items-center flex-wrap gap-1.5">
                            <span class="font-bold ${isRC ? 'text-orange-800' : 'text-gray-800'} text-sm">${piecePrefix}${kg} KG</span>
                            <span class="${obsBadgeClass} text-[9px] font-extrabold px-1.5 py-0.5 rounded shadow-sm uppercase tracking-wider">${obs}</span>
                        </div>
                        <div class="flex items-center gap-3 mt-1.5">
                            ${btnHtml}
                            <span class="text-[10px] ${isRC ? 'text-orange-500' : 'text-gray-400'} font-semibold flex-grow text-right">${logTime}</span>
                        </div>
                    </div>
                `;
                recognitionListContainer.appendChild(row);
            });

            recognitionModal.classList.remove('hidden');
        }

        function closeRecognitionModal(event) {
            if (event && event.target.id !== 'recognitionModal' && !event.target.closest('button')) return;
            recognitionModal.classList.add('hidden');
        }
        
        function editRecordFromRecognition(productId, timestamp, kg, name, contextKey) {
            recognitionModal.classList.add('hidden');
            openEditModal(productId, timestamp, kg, name, contextKey);
        }

        function saveNoteAndCloseRecognition() {
            const note = productGeneralNote.value.trim().toUpperCase();
            const cKey = recognitionContextKey.value;
            const pId = recognitionProductId.value;
            const uniqueKey = cKey + '_' + pId;

            if (note) {
                productNotes[uniqueKey] = note;
            } else {
                delete productNotes[uniqueKey];
            }
            
            // GUARDAR EL CONTEXTO QUE SE ACABA DE EDITAR PARA MANTENERLO ABIERTO
            lastEditedGroupContext = cKey; // cKey es el nombre del grupo (Sede o Nombre Proveedor)
            
            localStorage.setItem(PRODUCT_NOTES_KEY, JSON.stringify(productNotes));
            recognitionModal.classList.add('hidden');
            updateUI(); 
        }

        function openSubtractModal(timestamp, productId, contextKey, maxAmount) {
            subtractLogTimestamp.value = timestamp;
            subtractProductId.value = productId;
            subtractContextKey.value = contextKey;
            subtractMaxAmount.value = maxAmount;
            
            subtractAmountInput.value = '';
            subtractAmountInput.max = maxAmount;
            
            subtractModal.classList.remove('hidden');
            subtractAmountInput.focus();
        }

        function closeSubtractModal(event) {
             if (event && event.target.id !== 'subtractModal' && !event.target.closest('button')) return;
             subtractModal.classList.add('hidden');
        }

        function confirmSubtract() {
            const amountVal = parseFloat(subtractAmountInput.value);
            const maxVal = parseFloat(subtractMaxAmount.value);

            if (isNaN(amountVal) || amountVal <= 0) {
                showToast("Ingrese una cantidad válida", "error");
                return;
            }
            if (amountVal > maxVal) {
                showToast("No puede reconocer más de lo existente", "error");
                return;
            }

            const timestamp = parseInt(subtractLogTimestamp.value);
            const pId = subtractProductId.value;
            const cKey = subtractContextKey.value;

            const store = loadLocalStore();
            let dbKey = contextMap[cKey]; 
            
            if (!dbKey) {
                 dbKey = contextMap["PROVEEDOR"]; 
            }

            let data = store[dbKey] || {};
            let logs = data[pId] || [];
            
            const logIndex = logs.findIndex(l => l.timestamp === timestamp);
            if (logIndex === -1) {
                showToast("Error: Registro no encontrado", "error");
                return;
            }

            const originalLog = logs[logIndex];
            originalLog.desperdicio_kg = originalLog.desperdicio_kg - amountVal;
            
            const origAbbr = getDestAbbr(originalLog.observation);
            
            const newLog = {
                ...originalLog, 
                desperdicio_kg: amountVal,
                timestamp: Date.now(), 
                observation: origAbbr !== 'OTRO' ? `Destino: RC-${origAbbr}` : "Destino: RC" 
            };

            logs.push(newLog);  
            
            store[dbKey][pId] = logs;
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(store));

            // Sincronizar con el estado global en memoria para evitar reemplazos antiguos
            if (!cKey || dbKey === dataContext) {
                currentContextData = store[dbKey];
            }

            showToast("Reconocimiento aplicado exitosamente", "success");
            closeSubtractModal();
            closeRecognitionModal(); 
            
            // Aquí también deberíamos guardar lastEditedGroupContext si quisiéramos mantener abierto tras restar
            // Como closeRecognitionModal cierra el modal principal, no necesitamos hacer nada extra aquí
            // A menos que queramos mantener abierto tras reconocer, en cuyo caso:
            lastEditedGroupContext = cKey;
            
            updateUI();
        }


        // --- EDIT LOGIC (EXISTENTE, MANTENIDA PARA FUNCIONALIDAD NORMAL) ---
        function openEditModal(productId, timestamp, currentKg, productName, optionalContextKey) {
            editModalProductName.textContent = productName;
            editDesperdicioInput.value = currentKg;
            
            let contextDataToUse = currentContextData;
            let contextKeyToUse = null;

            if (viewMode === 'stats' && optionalContextKey) {
                const store = loadLocalStore();
                const dbKey = contextMap[optionalContextKey];
                if(!dbKey && optionalContextKey) {
                    contextDataToUse = store[contextMap["PROVEEDOR"]] || {};
                    contextKeyToUse = "PROVEEDOR"; 
                } else {
                     contextDataToUse = store[dbKey] || {};
                     contextKeyToUse = optionalContextKey;
                }
            }

            let currentObs = "";
            if (contextDataToUse[productId]) {
                const record = contextDataToUse[productId].find(log => log.timestamp === timestamp);
                if (record && record.observation) currentObs = record.observation;
            }
            editObservationInput.value = currentObs;
            editModalProductId.value = productId;
            editModalTimestamp.value = timestamp;
            editModalContextKey.value = contextKeyToUse || ""; 

            editRecordModal.classList.remove('hidden');
            editDesperdicioInput.focus();
            editDesperdicioInput.select(); 
        }

        function closeEditModal(event) {
            if (event && event.target.id !== 'editRecordModal') return;
            editRecordModal.classList.add('hidden');
        }

        function saveRecordChanges() {
            const productId = editModalProductId.value;
            const timestamp = parseInt(editModalTimestamp.value, 10); 
            const newKgString = editDesperdicioInput.value;
            const newObservation = editObservationInput.value.trim();
            const specificContextKey = editModalContextKey.value; 

            let newKg = parseFloat(newKgString);
            if (isNaN(newKg)) return;
            if (newKg === 0) { deleteRecord(); return; }

            let store = loadLocalStore();
            let dbKey = dataContext; 
            
            if (specificContextKey) {
                 if (contextMap[specificContextKey]) {
                     dbKey = contextMap[specificContextKey];
                 } else {
                     dbKey = contextMap["PROVEEDOR"]; 
                     if(contextMap[specificContextKey]) dbKey = contextMap[specificContextKey];
                 }
            }

            let targetData = store[dbKey] || {};

            if (targetData[productId]) {
                const recordIndex = targetData[productId].findIndex(log => log.timestamp === timestamp);
                if (recordIndex > -1) {
                    targetData[productId][recordIndex].desperdicio_kg = Math.abs(newKg);
                    targetData[productId][recordIndex].observation = newObservation;
                    
                    store[dbKey] = targetData;
                    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(store));

                    // Sincronizar memoria para que logNewWaste no sobreescriba esta actualización posteriormente
                    if (!specificContextKey || dbKey === dataContext) {
                        currentContextData = targetData; 
                    }

                    if (viewMode === 'stats') {
                        updateUI();
                    } else {
                        updateProductStateFromLocalData(); 
                        updateUI();
                    }
                    closeEditModal();
                } 
            } 
        }

        function deleteRecord() {
            const productId = editModalProductId.value;
            const timestamp = parseInt(editModalTimestamp.value, 10);
            const specificContextKey = editModalContextKey.value;

            let store = loadLocalStore();
            let dbKey = dataContext; 
            
            if (specificContextKey) {
                 if (contextMap[specificContextKey]) dbKey = contextMap[specificContextKey];
                 else dbKey = contextMap["PROVEEDOR"]; 
            }

            let targetData = store[dbKey] || {};

            if (targetData[productId]) {
                const recordIndex = targetData[productId].findIndex(log => log.timestamp === timestamp);
                if (recordIndex > -1) {
                    targetData[productId].splice(recordIndex, 1);
                    
                    store[dbKey] = targetData;
                    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(store));

                    // Sincronizar memoria para que logNewWaste no sobreescriba esta actualización posteriormente
                    if (!specificContextKey || dbKey === dataContext) {
                        currentContextData = targetData; 
                    }

                    if (viewMode === 'stats') {
                        updateUI();
                    } else {
                        updateProductStateFromLocalData(); 
                        updateUI();
                    }
                    closeEditModal();
                }
            }
        }

        // --- CONFIRM DELETE ---
        function openConfirmationModal() { 
            menuDropdown.classList.add('hidden'); 
            if(deletePasswordInput) deletePasswordInput.value = ''; 
            confirmationModal.classList.remove('hidden');
            if(deletePasswordInput) deletePasswordInput.focus();
        }
        function closeConfirmationModal(event) { if (event && event.target.id !== 'confirmationModal') return; confirmationModal.classList.add('hidden'); }
        function confirmClearData() {
            const pass = deletePasswordInput.value;
            if (pass !== '1234') {
                showToast("Clave incorrecta. No se borraron datos.", "error");
                return;
            }

            localStorage.removeItem(LOCAL_STORAGE_KEY);
            localStorage.removeItem(SUPPLIERS_LIST_KEY);
            localStorage.removeItem(CUSTOM_PRODUCTS_KEY);
            localStorage.removeItem(PRODUCT_NOTES_KEY);
            localStorage.removeItem(ACTIVE_KEY_STORAGE);
            localStorage.removeItem(ACTIVE_LABEL_STORAGE);
            localStorage.removeItem(ACTIVE_SUPPLIER_STORAGE);

            savedSuppliers = [];
            customProducts = [];
            productNotes = {};
            localWasteStore = {};
            currentActiveKey = "SELECCIONAR";
            currentActiveLabel = "SELECCIONE GRUPO O PROVEEDOR";
            currentSupplier = '';
            activeMenuItemText.textContent = currentActiveLabel;

            // Reestablecer lista de productos al estado base
            initialProductList = [...baseProductList].sort((a, b) => a.name.localeCompare(b.name));
            
            changeDataContext(null); 
            renderDropdownSuppliers();
            closeConfirmationModal();
            showToast("Datos, proveedores y productos manuales borrados.", "success");
        }

        function openAddProductModal() { if (viewMode === 'stats') return; newProductNameInput.value = ''; addProductModal.classList.remove('hidden'); newProductNameInput.focus(); }
        function closeAddProductModal(event) { if (event && event.target.id !== 'addProductModal') return; addProductModal.classList.add('hidden'); }
        function addNewProduct() {
            const name = newProductNameInput.value.trim().toUpperCase();
            if (!name) return;
            const exists = allProducts.some(p => p.name === name);
            if (exists) { showToast("¡Este producto ya existe!", "error"); return; }
            const newProduct = { name: name, imageUrl: DEFAULT_IMAGE_URL };
            customProducts.push(newProduct);
            localStorage.setItem(CUSTOM_PRODUCTS_KEY, JSON.stringify(customProducts));
            initialProductList.push(newProduct);
            initialProductList.sort((a, b) => a.name.localeCompare(b.name));
            updateProductStateFromLocalData();
            updateUI();
            closeAddProductModal();
            searchInput.value = name;
            filterProducts();
        }

        // --- RENDER UI ---
        function updateUI() {
            updateResponsibleUI();
            if (viewMode === 'stats') {
                productHeaderCol.classList.remove('entry-view-cols', 'w-full');
                productHeaderCol.classList.add('w-7/12', 'border-r');
                wasteHeaderCol.classList.remove('kg-visibility');
                tableHeader.classList.remove('hidden');
                renderGlobalStats(); // NEW GLOBAL RENDERER
            } else {
                productHeaderCol.classList.add('entry-view-cols', 'w-full');
                productHeaderCol.classList.remove('w-7/12', 'border-r');
                wasteHeaderCol.classList.add('kg-visibility');
                tableHeader.classList.remove('hidden');
                filterProducts(); 
            }
        }

        // --- NEW GLOBAL STATS RENDERER ---
        function renderGlobalStats() {
            const fmt = (num) => (num % 1 === 0) ? num : num.toFixed(2);
            const store = loadLocalStore();
            let combinedList = [];
            let globalTotal = 0;
            
            const searchTerm = searchInput.value.trim().toUpperCase();
            const isSearching = searchTerm.length > 0;

            contextKeys.forEach((cKey, cIndex) => { 
                const dbKey = contextMap[cKey];
                const contextData = store[dbKey] || {};

                initialProductList.forEach(prod => {
                    const pId = prod.name.toUpperCase().replace(/\s/g, '_');
                    const logs = contextData[pId] || [];

                    if (cKey === "PROVEEDOR") {
                        const supplierGroups = {}; 

                        logs.forEach(log => {
                            let sName = log.supplier || (log.responsible && log.responsible.startsWith("PROV:") ? log.responsible.replace("PROV:", "").trim() : "DESCONOCIDO");
                            if (!sName) sName = "DESCONOCIDO";
                            
                            if (!supplierGroups[sName]) supplierGroups[sName] = { total: 0, logs: [] };
                            const obs = (log.observation || '').toUpperCase();
                            if (!obs.includes('RC') && !obs.includes('RECONOCER')) {
                                supplierGroups[sName].total += (log.desperdicio_kg || 0);
                            }
                            supplierGroups[sName].logs.push(log);
                        });

                        for (const [sName, group] of Object.entries(supplierGroups)) {
                            if (group.total > 0) {
                                globalTotal += group.total;
                                combinedList.push({
                                    ...prod,
                                    id: pId,
                                    contextKey: sName, 
                                    isProvider: true,
                                    contextSortIndex: cIndex, 
                                    contextTotalKg: group.total,
                                    registros: group.logs.sort((a, b) => b.timestamp - a.timestamp)
                                });
                            }
                        }
                    } else {
                        const totalKg = logs.reduce((sum, l) => {
                            const obs = (l.observation || '').toUpperCase();
                            if (obs.includes('RC') || obs.includes('RECONOCER')) return sum;
                            return sum + (l.desperdicio_kg || 0);
                        }, 0);

                        if (totalKg > 0) {
                            globalTotal += totalKg;
                            combinedList.push({
                                ...prod,
                                id: pId,
                                contextKey: cKey,
                                isProvider: false,
                                contextSortIndex: cIndex, 
                                contextTotalKg: totalKg,
                                registros: logs.sort((a, b) => b.timestamp - a.timestamp)
                            });
                        }
                    }
                });
            });

            if (searchTerm) {
                combinedList = combinedList.filter(item => {
                    const prodName = item.name.toUpperCase();
                    const ctxName = item.contextKey.toUpperCase();
                    return prodName.includes(searchTerm) || ctxName.includes(searchTerm);
                });
                globalTotal = combinedList.reduce((acc, item) => acc + item.contextTotalKg, 0);
            }

            // Ordenar lista para agrupar
            combinedList.sort((a, b) => {
                if (a.contextSortIndex !== b.contextSortIndex) {
                    return a.contextSortIndex - b.contextSortIndex;
                }
                if (a.isProvider && b.isProvider && a.contextKey !== b.contextKey) {
                    return a.contextKey.localeCompare(b.contextKey);
                }
                return a.name.localeCompare(b.name);
            });

            if (combinedList.length === 0) {
                 productListContainer.innerHTML = `
                    <div class="p-8 text-center text-gray-500">
                        <p class="text-lg font-bold mb-2">Sin Datos</p>
                        <p class="text-sm">No hay registros que coincidan con la búsqueda.</p>
                    </div>`;
                return;
            }

            // --- AGRUPAR POR CONTEXTO (SEDE) PARA ACORDEONES ---
            const groups = [];
            if (combinedList.length > 0) {
                let currentContext = combinedList[0].contextKey;
                let currentItems = [];
                
                combinedList.forEach(item => {
                    if (item.contextKey !== currentContext) {
                        groups.push({ name: currentContext, items: currentItems });
                        currentContext = item.contextKey;
                        currentItems = [];
                    }
                    currentItems.push(item);
                });
                groups.push({ name: currentContext, items: currentItems });
            }

            let htmlContent = `
                <div class="p-4 bg-indigo-50 rounded-t-lg border-b border-indigo-100 z-10 shadow-sm mb-2">
                    <h3 class="text-xs font-bold text-indigo-600 uppercase">Total Global ${searchTerm ? '(Filtrado)' : '(Todas las Sedes)'}</h3>
                    <p class="text-3xl font-extrabold text-indigo-900">${globalTotal.toFixed(2)} KG</p>
                </div>
                <div class="p-2 pb-20 space-y-3">`;

            groups.forEach(group => {
                const groupTotal = group.items.reduce((sum, i) => sum + i.contextTotalKg, 0);
                // ID seguro para el HTML
                const safeId = group.name.replace(/[^a-zA-Z0-9]/g, '_');
                
                // --- NUEVA LÓGICA DE APERTURA ---
                let shouldOpen = isSearching; // Siempre abrir si se busca
                
                if (!shouldOpen) {
                    // Si no se está buscando, verificar contexto activo
                    if (currentActiveKey === "PROVEEDOR") {
                         // Si venimos de la vista proveedor, abrir solo si coincide el nombre
                         if (group.name === currentSupplier) shouldOpen = true;
                    } else {
                         // Si venimos de una sede, abrir si coincide el nombre
                         if (group.name === currentActiveKey) shouldOpen = true;
                    }
                }

                // Además, si acabamos de editar este grupo (agregar nota o reconocer), mantenerlo abierto
                if (lastEditedGroupContext && group.name === lastEditedGroupContext) {
                    shouldOpen = true;
                }

                const isOpen = shouldOpen;

                htmlContent += `
                    <div class="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden transition-all duration-200">
                        <button onclick="toggleAccordion('${safeId}')" class="w-full flex justify-between items-center p-4 bg-white hover:bg-gray-50 transition text-left active:bg-gray-100">
                            <div class="flex items-center">
                                <div class="bg-indigo-100 p-2 rounded-lg mr-3">
                                    <svg class="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
                                </div>
                                <div class="flex flex-col">
                                    <span class="font-extrabold text-gray-800 uppercase tracking-wide text-sm">${group.name}</span>
                                    <span class="text-xs text-gray-500 font-semibold">${group.items.length} Productos</span>
                                </div>
                            </div>
                            <div class="flex items-center">
                                <span class="text-sm font-extrabold text-indigo-700 mr-3 bg-indigo-50 px-2 py-1 rounded">${groupTotal.toFixed(2)} KG</span>
                                <svg id="icon-${safeId}" class="w-5 h-5 text-gray-400 transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                            </div>
                        </button>
                        
                        <!-- CONTENIDO DESPLEGABLE -->
                        <div id="content-${safeId}" class="${isOpen ? '' : 'hidden'} bg-gray-50 border-t border-gray-100">
                            <div class="p-2 space-y-2">
                `;

                group.items.forEach((item, index) => {
                    const uniqueKey = item.contextKey + '_' + item.id;
                    const hasNote = !!productNotes[uniqueKey];

                    let cardBgClass = "bg-white";
                    let badgeClass = "";
                    let textMainClass = "text-gray-800";
                    let textBreakdownRedClass = "text-red-500"; 
                    let textBreakdownTotalClass = "text-red-600"; 

                    // LOGICA DE COLORES BASE
                    if (item.isProvider) {
                         badgeClass = "bg-purple-100 text-purple-800 border-purple-200"; 
                    } else if(item.contextKey === "SAN ROQUE") {
                         badgeClass = "bg-blue-100 text-blue-800 border-blue-200";
                    } else if(item.contextKey === "MARAJABU") {
                         badgeClass = "bg-orange-100 text-orange-800 border-orange-200";
                    } else {
                         badgeClass = "bg-indigo-50 text-indigo-800 border-indigo-200";
                    }

                    if (hasNote) {
                        cardBgClass = "bg-red-500"; 
                        textMainClass = "text-white"; 
                        textBreakdownRedClass = "text-black"; 
                        textBreakdownTotalClass = "text-white"; 
                        badgeClass = "bg-white text-red-600 border-white"; 
                    }

                    // --- DESGLOSE ---
                    let totalFG = 0;
                    let totalMF = 0;
                    let totalF = 0;
                    let totalRC = 0; 
                    
                    let rcFG = 0;
                    let rcMF = 0;
                    let rcF = 0;
                    let rcOther = 0;
                    let currentPiece = 1;
                    
                    let detailedBreakdownHtml = '<div class="px-3 pb-2 pt-1 grid grid-cols-2 sm:flex sm:flex-wrap gap-1 border-t border-gray-100">';
                    
                    // Invertir para que la primera (más antigua) sea P#01
                    const sortedRegistros = [...item.registros].reverse();
                    const groupOrder = []; // Para mantener el orden de aparición de los grupos

                    const processedLogs = sortedRegistros.map(log => {
                        const kg = log.desperdicio_kg;
                        const obs = (log.observation || '').toUpperCase();
                        const isRC = obs.includes('RC') || obs.includes('RECONOCER');
                        
                        if (isRC) {
                            totalRC += kg;
                            if (obs.includes('-FG')) rcFG += kg;
                            else if (obs.includes('-MF')) rcMF += kg;
                            else if (obs.includes('-F')) rcF += kg;
                            else rcOther += kg;
                        } else if (obs.includes('FERIA GRANDE')) {
                            totalFG += kg;
                        } else if (obs.includes('MINI FERIA')) {
                            totalMF += kg;
                        } else if (obs.includes('FRUTERIA') || obs.includes('FRUTERÍA')) {
                            totalF += kg;
                        }

                        let destGroup = 'OTHER';
                        if (obs.includes('FERIA GRANDE') || obs.includes('-FG')) destGroup = 'FG';
                        else if (obs.includes('MINI FERIA') || obs.includes('-MF')) destGroup = 'MF';
                        else if (obs.includes('FRUTERIA') || obs.includes('FRUTERÍA') || obs.includes('-F')) destGroup = 'F';

                        // Guardar el orden de aparición del grupo si es nuevo
                        if (!groupOrder.includes(destGroup)) groupOrder.push(destGroup);

                        const singleKg = (kg % 1 === 0) ? kg : kg.toFixed(2);
                        const singleAbbr = getDestAbbr(log.observation);
                        const bgColor = isRC ? 'bg-orange-500' : 'bg-gray-600';
                        
                        let piecePrefix = '';
                        if (!isRC) {
                            piecePrefix = `P#${String(currentPiece).padStart(2, '0')} • `;
                            currentPiece++;
                        }

                        return { kg, obs, isRC, destGroup, singleKg, singleAbbr, bgColor, piecePrefix };
                    });

                    const groups = {};
                    processedLogs.forEach(log => {
                        if (!groups[log.destGroup]) groups[log.destGroup] = { pesas: [], rcs: [] };
                        if (log.isRC) groups[log.destGroup].rcs.push(log);
                        else groups[log.destGroup].pesas.push(log);
                    });

                    // Renderizar los grupos en el orden que aparecieron cronológicamente
                    groupOrder.forEach(key => {
                        if (!groups[key]) return;
                        const g = groups[key];
                        const maxLen = Math.max(g.pesas.length, g.rcs.length);
                        for(let i=0; i<maxLen; i++) {
                            const rc = g.rcs[i];
                            const pesa = g.pesas[i];
                            
                            // Lado Izquierdo: RC
                            if (rc) {
                                detailedBreakdownHtml += `<div class="${rc.bgColor} text-white px-1 py-1 rounded text-[11px] font-bold shadow-sm text-center truncate" title="${rc.piecePrefix}${rc.singleKg} (${rc.singleAbbr})">${rc.piecePrefix}${rc.singleKg} (${rc.singleAbbr})</div>`;
                            } else {
                                detailedBreakdownHtml += `<div></div>`;
                            }

                            // Lado Derecho: Pesa
                            if (pesa) {
                                detailedBreakdownHtml += `<div class="${pesa.bgColor} text-white px-1 py-1 rounded text-[11px] font-bold shadow-sm text-center truncate" title="${pesa.piecePrefix}${pesa.singleKg} (${pesa.singleAbbr})">${pesa.piecePrefix}${pesa.singleKg} (${pesa.singleAbbr})</div>`;
                            } else {
                                detailedBreakdownHtml += `<div></div>`;
                            }
                        }
                    });
                    
                    detailedBreakdownHtml += '</div>';

                    let breakdownHtml = `<div class="flex flex-col text-right ml-2 leading-tight whitespace-nowrap">`;
                    
                    if (totalFG > 0 || rcFG > 0) {
                        let textHtml = '';
                        if (rcFG > 0) textHtml += `<span class="${hasNote ? 'text-yellow-300' : 'text-orange-500'} mr-1">RC-FG:${fmt(rcFG)}</span>`;
                        if (totalFG > 0) textHtml += `<span class="${textBreakdownRedClass}">FG:${fmt(totalFG)}</span>`;
                        breakdownHtml += `<span class="text-[11px] font-bold flex items-center justify-end">${textHtml}</span>`;
                    }
                    if (totalMF > 0 || rcMF > 0) {
                        let textHtml = '';
                        if (rcMF > 0) textHtml += `<span class="${hasNote ? 'text-yellow-300' : 'text-orange-500'} mr-1">RC-MF:${fmt(rcMF)}</span>`;
                        if (totalMF > 0) textHtml += `<span class="${textBreakdownRedClass}">MF:${fmt(totalMF)}</span>`;
                        breakdownHtml += `<span class="text-[11px] font-bold flex items-center justify-end">${textHtml}</span>`;
                    }
                    if (totalF > 0 || rcF > 0) {
                        let textHtml = '';
                        if (rcF > 0) textHtml += `<span class="${hasNote ? 'text-yellow-300' : 'text-orange-500'} mr-1">RC-F:${fmt(rcF)}</span>`;
                        if (totalF > 0) textHtml += `<span class="${textBreakdownRedClass}">F:${fmt(totalF)}</span>`;
                        breakdownHtml += `<span class="text-[11px] font-bold flex items-center justify-end">${textHtml}</span>`;
                    }
                    if (rcOther > 0) {
                        breakdownHtml += `<span class="text-[11px] font-bold ${hasNote ? 'text-yellow-300' : 'text-orange-500'} flex items-center justify-end">RC:${fmt(rcOther)}</span>`;
                    }
                    
                    breakdownHtml += `<span class="text-sm font-extrabold ${textBreakdownTotalClass} ${hasNote ? 'border-red-400' : 'border-red-200'} border-t mt-0.5 pt-0.5">T:${fmt(item.contextTotalKg)}KG</span>`;
                    breakdownHtml += `</div>`;

                    const encodedLogs = encodeURIComponent(JSON.stringify(item.registros));
                    const productNameString = item.name.replace(/'/g, "\\'");
                    const rowAction = `openRecognitionModal('${productNameString}', '${item.id}', '${item.contextKey}', '${encodedLogs}')`;

                    htmlContent += `
                        <div class="${cardBgClass} border rounded-lg shadow-sm overflow-hidden mb-1" onclick="${rowAction}">
                            <div class="flex justify-between items-center p-3 ${hasNote ? 'border-red-400 hover:bg-red-400' : 'border-gray-100 hover:bg-white'} transition cursor-pointer relative">
                                <div class="flex items-center flex-grow py-1 min-w-0" onclick="event.stopPropagation(); window.openModalInStats('${item.id}', '${item.contextKey}', ${item.isProvider ? 'true' : 'false'})"> 
                                    <span class="text-xs font-bold mr-2 w-4 flex-shrink-0 ${hasNote ? 'text-red-200' : 'text-gray-400'}">${index + 1}.</span>
                                    <img src="${item.imageUrl}" class="product-image flex-shrink-0" onerror="this.onerror=null; this.src='${DEFAULT_IMAGE_URL}'">
                                    <div class="flex flex-col ml-1 min-w-0 pr-1">
                                        <span class="text-[11px] font-bold leading-tight ${textMainClass} break-words">${item.name}</span>
                                        <span class="text-[9px] text-gray-400 font-bold mt-0.5 whitespace-nowrap">TOCA PARA AÑADIR +</span>
                                    </div>
                                </div>
                                <div class="flex flex-col items-end flex-shrink-0">
                                    ${breakdownHtml}
                                </div>
                            </div>
                            
                            ${detailedBreakdownHtml}

                            <div class="${hasNote ? 'bg-red-700 text-white' : 'bg-gray-100 text-indigo-400'} px-3 py-1 text-center text-[10px] font-bold uppercase tracking-wider">
                                ${hasNote ? 'TIENE OBSERVACIÓN' : 'Toca para reconocer'}
                            </div>
                        </div>
                    `;
                });

                htmlContent += `
                            </div>
                        </div>
                    </div>
                `;
            });
            htmlContent += '</div>'; 
            productListContainer.innerHTML = htmlContent;
        }

        function filterProducts() {
            if (viewMode === 'stats') {
                renderGlobalStats();
                return;
            }
            
            productListContainer.innerHTML = '';
            const searchTerm = searchInput.value.trim().toLowerCase();
            const filteredProducts = allProducts.filter(product => product.name.toLowerCase().includes(searchTerm));

            if (filteredProducts.length === 0) {
                productListContainer.innerHTML = `<div class="p-4 text-center text-gray-500">No encontrado.</div>`;
                return;
            }

            filteredProducts.forEach(product => {
                const productRow = document.createElement('div');
                productRow.className = 'w-full flex text-sm text-gray-700 border-t border-gray-200 product-row-button items-center p-3';
                productRow.onclick = () => openModal(product); 
                productRow.innerHTML = `
                    <img src="${product.imageUrl || DEFAULT_IMAGE_URL}" class="product-image" onerror="this.onerror=null; this.src='${DEFAULT_IMAGE_URL}'">
                    <span class="flex-grow font-semibold">${product.name}</span>
                    <svg class="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
                `;
                productListContainer.appendChild(productRow);
            });
        }
        
        searchInput.addEventListener('input', filterProducts);
        updateResponsibleUI();
        
        // --- AUTO-ACTIVAR CONTEXTO GUARDADO ---
        if (currentActiveKey && currentActiveKey !== "SELECCIONAR") {
            activateContext(currentActiveKey, currentActiveLabel);
        } else {
            changeDataContext(null);
        }
        
        renderDropdownSuppliers();