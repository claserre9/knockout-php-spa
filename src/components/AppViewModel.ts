import BaseViewModel from "./BaseViewModel";
import {computed, observable} from "knockout";
import "./../styles/styles.css"

export default class AppViewModel extends BaseViewModel {
    public uppercaseLetters = observable("ABCDEFGHIJKLMNOPQRSTUVWXYZ");
    public lowercaseLetters = observable("abcdefghijklmnopqrstuvwxyz");
    public numbers = observable("0123456789");
    public symbols = observable("!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~");
    public password = observable("");
    public passwordLength = observable(20);
    public useNumbers = observable(true);
    public useSymbols = observable(true);
    public selectedAlphabet = observable("all");
    public currentTab = observable("Password Generator");
    public passwordStrength = computed(() => {
        const password = this.password();
        let score = 0;
        score += Math.min(20, password.length * 1.5); // Max score for length is 20
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumber = /[0-9]/.test(password);
        const hasSymbol = /[\W_]/.test(password); // Standard symbols
        const hasUnicode = /[\u00A1-\uFFFF]/.test(password); // Extended Unicode characters
        const varietyScore = [hasUpperCase, hasLowerCase, hasNumber, hasSymbol, hasUnicode].filter(Boolean).length * 10;
        score += Math.min(30, varietyScore); // Cap variety score at 30
        const commonPatterns = [
            /(.)\1{2,}/, // Repeated characters like aaa, 111
            /(012|123|234|345|456|567|678|789|890)/, // Numeric sequences
            /(abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz)/i, // Alphabetic sequences
            /(qwerty|asdf|zxcv|password|letmein|welcome|iloveyou|admin|login|abc123)/i // Common patterns and passwords
        ];
        const hasNoCommonPatterns = commonPatterns.every((pattern) => !pattern.test(password));
        if (hasNoCommonPatterns) score += 20;
        const uniqueChars = new Set(password).size;
        if (uniqueChars >= 8) score += 10;
        if (uniqueChars >= 12) score += 10;
        let strengthLabel = "";
        if (score <= 20) {
            strengthLabel = "Very Weak";
        } else if (score <= 40) {
            strengthLabel = "Weak";
        } else if (score <= 60) {
            strengthLabel = "Moderate";
        } else if (score <= 80) {
            strengthLabel = "Strong";
        } else {
            strengthLabel = "Very Strong";
        }
        return { score, strengthLabel };
    });

    constructor() {
        super();
        // simpler template `css` changed to `cls` for syntax error prevention
        this.template = `
<div id="app">
    <div class="container">
        <div class="tabs">
            <button class="tab-button" data-bind="click: openTab.bind($data, 'Password Generator'), css: { active: currentTab() === 'Password Generator' }">
                Password Generator
            </button>
            <button class="tab-button" data-bind="click: openTab.bind($data, 'Base 32/Base 64'), css: { active: currentTab() === 'Base 32/Base 64' }">
                Base 32/Base 64
            </button>
        </div>
        <div class="content">
            <div id="Password Generator" class="tab-content" data-bind="css: { 'active-content': currentTab() === 'Password Generator' }">
                <h2>Password Generator</h2>
                <form id="password_generator_form" data-bind="submit:generatePassword">
                    <div class="form-group" style="margin-bottom: 10px;">
                        <label for="password_length">Password Length:</label>
                        <input data-bind="value:passwordLength" type="number" name="password_length" id="password_length" min="1" max="128" required>
                    </div>
                    
                    <div class="form-group" style="margin-bottom: 10px;">
                        <label for="use_numbers">Include Numbers:</label>
                        <input data-bind="checked:useNumbers" type="checkbox" name="use_numbers" id="use_numbers">
                    </div>
                    
                    <div class="form-group" style="margin-bottom: 10px;">
                        <label for="use_symbols">Include Symbols:</label>
                        <input data-bind="checked:useSymbols" type="checkbox" name="use_symbols" id="use_symbols">
                        <input data-bind="value:symbols" type="text" name="symbols">
                    </div>
                    
                    <div class="form-group" style="margin-bottom: 10px;">
                        <label for="alphabet">Alphabet</label>
                        <select id="alphabet" name="alphabet" class="form-control" data-bind="value: selectedAlphabet">
                            <option value="all">All</option>
                            <option value="uppercase">Uppercase</option>
                            <option value="lowercase">Lowercase</option>
                        </select>
                    </div>
                    
                    <div class="form-group" style="margin-bottom: 10px;">
                        <input type="submit" value="Generate" id="generate_password" style="display: block;">
                    </div>
                </form>
                <!-- ko if: password -->
                <div>
                    <hr>
                    <br>
                    <div>
                        <label style="display: block; margin-bottom: 5px">Password:</label>
                        <span data-bind="text: password"></span>
                        <button data-bind="click: copyPassword">Copy</button>
                    </div>
                    <br>
                    <div>
                        <label style="display: block; margin-bottom: 5px">Password Strength:</label>
                        <span data-bind="text: passwordStrength().strengthLabel"></span>
                    </div>
                    <div>
                        <progress data-bind="value: passwordStrength().score, attr:{ max:90, title:passwordStrength().score }"></progress>
                    </div>
                </div>
                <!-- /ko -->
            </div>
            <div id="base3264" class="tab-content" data-bind="css: { 'active-content': currentTab() === 'Base 32/Base 64' }">
                <h2>Base 32/Base 64</h2>
                <label for="decoded_input">Decoded Input</label>
               <textarea id="decoded_input" name="decoded_input"  cols="30" rows="10"></textarea>
            </div>
        </div>
    </div>
</div>
`;
        this.generatePassword();
    }

    public openTab(tabName: string) {
        this.currentTab(tabName);
    }

    public generatePassword() {
        const symbols = this.symbols().split("");
        const numbers = this.numbers().split("");
        const uppercaseLetters = this.uppercaseLetters().split("");
        const lowercaseLetters = this.lowercaseLetters().split("");
        const passwordLength = this.passwordLength();
        const useNumbers = this.useNumbers();
        const useSymbols = this.useSymbols();
        const alphabetSelection = this.selectedAlphabet();
        let characterPool: string[] = [];
        let mandatoryCharacters: string[] = [];

        if (alphabetSelection === "all") {
            characterPool = [...lowercaseLetters, ...uppercaseLetters];
        } else if (alphabetSelection === "uppercase") {
            characterPool = [...uppercaseLetters];
        } else if (alphabetSelection === "lowercase") {
            characterPool = [...lowercaseLetters];
        }
        if (useNumbers) {
            characterPool = characterPool.concat(numbers);
            mandatoryCharacters.push(numbers[Math.floor(Math.random() * numbers.length)]);
        }
        if (useSymbols) {
            characterPool = characterPool.concat(symbols);
            mandatoryCharacters.push(symbols[Math.floor(Math.random() * symbols.length)]);
        }
        if (characterPool.length === 0) {
            throw new Error("Character pool cannot be empty. Check your configurations.");
        }
        for (let i = characterPool.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [characterPool[i], characterPool[j]] = [characterPool[j], characterPool[i]];
        }
        let passwordParts = [];
        for (let i = 0; i < passwordLength - mandatoryCharacters.length; i++) {
            passwordParts.push(characterPool[Math.floor(Math.random() * characterPool.length)]);
        }
        passwordParts = passwordParts.concat(mandatoryCharacters);
        for (let i = passwordParts.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [passwordParts[i], passwordParts[j]] = [passwordParts[j], passwordParts[i]];
        }
        const password = passwordParts.join('');
        this.password(password);
    }

    public copyPassword = () => {
        const password = this.password();
        navigator.clipboard.writeText(password).then(() => {
            alert('Password copied to clipboard!');
        }).catch(err => {
            console.error('Failed to copy password: ', err);
        });
    };
}