/*!
 * Kalkulator Różnic Wieku - Skrypt JavaScript
 * Autor: [Twoje Imię]
 * Wersja: 1.0.0
 * Opis: Logika kalkulatora do obliczania różnic wieku z animacjami
 */

'use strict';

/**
 * Główna klasa kalkulatora wieku
 */
class AgeCalculator {
    constructor() {
        this.initializeElements();
        this.bindEvents();
    }

    /**
     * Inicjalizacja elementów DOM
     */
    initializeElements() {
        this.form = document.getElementById('ageForm');
        this.myAgeInput = document.getElementById('myAge');
        this.otherAgeInput = document.getElementById('otherAge');
        this.result = document.getElementById('result');
        this.error = document.getElementById('error');
        this.circlesContainer = document.getElementById('circlesContainer');
        this.myAgeDisplay = document.getElementById('myAgeDisplay');
        this.otherAgeDisplay = document.getElementById('otherAgeDisplay');
        this.myAgeTitle = document.getElementById('myAgeTitle');
        this.timeInfo = document.getElementById('timeInfo');
    }

    /**
     * Bindowanie event listenerów
     */
    bindEvents() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        this.myAgeInput.addEventListener('input', () => this.clearMessages());
        this.otherAgeInput.addEventListener('input', () => this.clearMessages());
    }

    /**
     * Pobiera wybraną płeć
     * @returns {string} 'male' lub 'female'
     */
    getGender() {
        const genderInput = document.querySelector('input[name="gender"]:checked');
        return genderInput ? genderInput.value : 'male';
    }

    /**
     * Zwraca teksty w odpowiednim rodzaju gramatycznym
     * @param {string} gender - płeć ('male' lub 'female')
     * @returns {object} obiekt z tekstami
     */
    getGenderTexts(gender) {
        if (gender === 'female') {
            return {
                wasOlder: 'byłaś dwa razy starsza',
                willBeOlder: 'będziesz dwa razy starsza', 
                isOlder: 'jesteś dokładnie dwa razy starsza',
                wasYounger: 'byłaś dwa razy młodsza',
                willBeYounger: 'będziesz dwa razy młodsza',
                isYounger: 'jesteś dokładnie dwa razy młodsza',
                titleWasOlder: 'Wiek w którym byłaś dwa razy starsza',
                titleWillBeOlder: 'Wiek w którym będziesz dwa razy starsza',
                titleIsOlder: 'Wiek w którym jesteś dwa razy starsza',
                titleWasYounger: 'Wiek w którym byłaś dwa razy młodsza',
                titleWillBeYounger: 'Wiek w którym będziesz dwa razy młodsza',
                titleIsYounger: 'Wiek w którym jesteś dwa razy młodsza'
            };
        } else {
            return {
                wasOlder: 'byłeś dwa razy starszy',
                willBeOlder: 'będziesz dwa razy starszy',
                isOlder: 'jesteś dokładnie dwa razy starszy',
                wasYounger: 'byłeś dwa razy młodszy', 
                willBeYounger: 'będziesz dwa razy młodszy',
                isYounger: 'jesteś dokładnie dwa razy młodszy',
                titleWasOlder: 'Wiek w którym byłeś dwa razy starszy',
                titleWillBeOlder: 'Wiek w którym będziesz dwa razy starszy',
                titleIsOlder: 'Wiek w którym jesteś dwa razy starszy',
                titleWasYounger: 'Wiek w którym byłeś dwa razy młodszy',
                titleWillBeYounger: 'Wiek w którym będziesz dwa razy młodszy',
                titleIsYounger: 'Wiek w którym jesteś dwa razy młodszy'
            };
        }
    }

    /**
     * Obsługa submitu formularza
     * @param {Event} e - event object
     */
    handleSubmit(e) {
        e.preventDefault();
        
        const myAge = parseInt(this.myAgeInput.value);
        const otherAge = parseInt(this.otherAgeInput.value);
        
        if (!this.validateAges(myAge, otherAge)) {
            return;
        }
        
        this.calculate(myAge, otherAge);
    }

    /**
     * Walidacja wprowadzonych wieków
     * @param {number} myAge - mój wiek
     * @param {number} otherAge - wiek drugiej osoby
     * @returns {boolean} true jeśli dane są poprawne
     */
    validateAges(myAge, otherAge) {
        if (isNaN(myAge) || isNaN(otherAge)) {
            this.showError('Wprowadź prawidłowe liczby');
            return false;
        }
        
        if (myAge < 0 || myAge > 150 || otherAge < 0 || otherAge > 150) {
            this.showError('Wiek musi być z zakresu 0-150 lat');
            return false;
        }
        
        return true;
    }

    /**
     * Główna funkcja obliczeniowa
     * @param {number} myAge - mój wiek
     * @param {number} otherAge - wiek drugiej osoby
     */
    calculate(myAge, otherAge) {
        const ageDifference = Math.abs(myAge - otherAge);
        const gender = this.getGender();
        const texts = this.getGenderTexts(gender);
        
        // Obliczenia matematyczne
        // Dla "dwa razy starszy": myAge + t1 = 2 * (otherAge + t1)
        // Rozwiązanie: t1 = myAge - 2 * otherAge
        const t1 = myAge - 2 * otherAge;
        
        // Dla "dwa razy młodszy": otherAge + t2 = 2 * (myAge + t2)
        // Rozwiązanie: t2 = otherAge - 2 * myAge
        const t2 = otherAge - 2 * myAge;
        
        let result = `<div class="result-item">Różnica wieku: <span class="difference">${ageDifference} lat</span></div>`;
        
        // Sprawdź która relacja jest możliwa
        const myAgeAtT1 = myAge + t1;
        const otherAgeAtT1 = otherAge + t1;
        const myAgeAtT2 = myAge + t2;
        const otherAgeAtT2 = otherAge + t2;
        
        let relationFound = false;
        let circleMyAge = null;
        let circleOtherAge = null;
        let titleText = '';
        let timeText = '';
        
        // Sprawdź relację "2x starszy"
        if (myAgeAtT1 > 0 && otherAgeAtT1 > 0) {
            circleMyAge = myAgeAtT1;
            circleOtherAge = otherAgeAtT1;
            
            if (t1 === 0) {
                titleText = texts.titleIsOlder;
                result += `<div class="result-item relation">Obecnie ${texts.isOlder}</div>`;
                timeText = `Obecnie ${texts.isOlder}`;
            } else if (t1 > 0) {
                titleText = texts.titleWillBeOlder;
                result += `<div class="result-item relation">Za ${t1} lat ${texts.willBeOlder}</div>`;
                timeText = `Za ${t1} lat ${texts.willBeOlder}`;
            } else {
                titleText = texts.titleWasOlder;
                result += `<div class="result-item relation">${Math.abs(t1)} lat temu ${texts.wasOlder}</div>`;
                timeText = `${Math.abs(t1)} lat temu ${texts.wasOlder}`;
            }
            relationFound = true;
        }
        
        // Sprawdź relację "2x młodszy" (tylko jeśli nie znaleziono poprzedniej)
        if (!relationFound && myAgeAtT2 > 0 && otherAgeAtT2 > 0) {
            circleMyAge = myAgeAtT2;
            circleOtherAge = otherAgeAtT2;
            
            if (t2 === 0) {
                titleText = texts.titleIsYounger;
                result += `<div class="result-item relation">Obecnie ${texts.isYounger}</div>`;
                timeText = `Obecnie ${texts.isYounger}`;
            } else if (t2 > 0) {
                titleText = texts.titleWillBeYounger;
                result += `<div class="result-item relation">Za ${t2} lat ${texts.willBeYounger}</div>`;
                timeText = `Za ${t2} lat ${texts.willBeYounger}`;
            } else {
                titleText = texts.titleWasYounger;
                result += `<div class="result-item relation">${Math.abs(t2)} lat temu ${texts.wasYounger}</div>`;
                timeText = `${Math.abs(t2)} lat temu ${texts.wasYounger}`;
            }
            relationFound = true;
        }
        
        if (!relationFound) {
            result += `<div class="result-item">Brak możliwej relacji 2x przy dodatnich wiekach</div>`;
            this.hideCircles();
        } else {
            this.showCircles(circleMyAge, circleOtherAge, titleText, timeText);
        }
        
        this.showResult(result);
    }

    /**
     * Pokazuje koła z wiekami
     * @param {number} myAge - mój wiek w momencie relacji
     * @param {number} otherAge - wiek drugiej osoby w momencie relacji
     * @param {string} titleText - tekst tytułu
     * @param {string} timeText - tekst informacji czasowej
     */
    showCircles(myAge, otherAge, titleText, timeText) {
        // Aktualizuj liczby w kołach
        this.myAgeDisplay.textContent = myAge;
        this.otherAgeDisplay.textContent = otherAge;
        this.myAgeTitle.textContent = titleText;
        this.timeInfo.textContent = timeText;
        
        // Pokaż kontener z kołami z animacją
        this.circlesContainer.classList.remove('hidden');
        setTimeout(() => {
            this.circlesContainer.classList.add('show');
        }, 100);
    }

    /**
     * Ukrywa koła z wiekami
     */
    hideCircles() {
        this.circlesContainer.classList.remove('show');
        setTimeout(() => {
            this.circlesContainer.classList.add('hidden');
        }, 800);
    }

    /**
     * Pokazuje wyniki
     * @param {string} content - HTML content wyników
     */
    showResult(content) {
        this.result.innerHTML = content;
        this.result.classList.remove('hidden');
        this.error.classList.add('hidden');
    }

    /**
     * Pokazuje błąd
     * @param {string} message - treść błędu
     */
    showError(message) {
        this.error.textContent = message;
        this.error.classList.remove('hidden');
        this.result.classList.add('hidden');
        this.hideCircles();
    }

    /**
     * Czyści komunikaty i ukrywa koła
     */
    clearMessages() {
        this.result.classList.add('hidden');
        this.error.classList.add('hidden');
        this.hideCircles();
    }
}

/**
 * Inicjalizacja aplikacji po załadowaniu DOM
 */
document.addEventListener('DOMContentLoaded', () => {
    // Sprawdź czy wszystkie wymagane elementy istnieją
    const requiredElements = [
        'ageForm', 'myAge', 'otherAge', 'result', 'error',
        'circlesContainer', 'myAgeDisplay', 'otherAgeDisplay',
        'myAgeTitle', 'timeInfo'
    ];
    
    const missingElements = requiredElements.filter(id => !document.getElementById(id));
    
    if (missingElements.length > 0) {
        console.error('Brakujące elementy DOM:', missingElements);
        return;
    }
    
    // Inicjalizuj kalkulator
    new AgeCalculator();
    
    console.log('✅ Kalkulator Różnic Wieku został zainicjalizowany');
});

/**
 * Obsługa błędów JavaScript
 */
window.addEventListener('error', (e) => {
    console.error('Błąd JavaScript:', e.error);
});

/**
 * Eksport dla modułów (opcjonalnie)
 */
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AgeCalculator;
} 