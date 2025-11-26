// Farm Expense Tracker - API Client
// Handles communication with the Flask backend API

class FarmAPIClient {
    constructor(baseURL = 'http://localhost:5000') {
        this.baseURL = baseURL;
        this.token = localStorage.getItem('auth_token');
    }

    // Authentication methods
    async register(name, email, farmName, password) {
        const response = await fetch(`${this.baseURL}/api/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email, farmName, password })
        });
        return this.handleResponse(response);
    }

    async login(email, password) {
        const response = await fetch(`${this.baseURL}/api/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password })
        });
        const result = await this.handleResponse(response);
        if (result.success && result.user) {
            this.token = result.token || 'session-based';
            localStorage.setItem('auth_token', this.token);
        }
        return result;
    }

    async logout() {
        const response = await fetch(`${this.baseURL}/api/auth/logout`, {
            method: 'POST',
            headers: this.getHeaders()
        });
        const result = await this.handleResponse(response);
        if (result.success) {
            this.token = null;
            localStorage.removeItem('auth_token');
        }
        return result;
    }

    async getCurrentUser() {
        const response = await fetch(`${this.baseURL}/api/auth/me`, {
            headers: this.getHeaders()
        });
        return this.handleResponse(response);
    }

    // Expense methods
    async getExpenses() {
        const response = await fetch(`${this.baseURL}/api/expenses`, {
            headers: this.getHeaders()
        });
        return this.handleResponse(response);
    }

    async createExpense(expenseData) {
        const response = await fetch(`${this.baseURL}/api/expenses`, {
            method: 'POST',
            headers: this.getHeaders(),
            body: JSON.stringify(expenseData)
        });
        return this.handleResponse(response);
    }

    async updateExpense(expenseId, expenseData) {
        const response = await fetch(`${this.baseURL}/api/expenses/${expenseId}`, {
            method: 'PUT',
            headers: this.getHeaders(),
            body: JSON.stringify(expenseData)
        });
        return this.handleResponse(response);
    }

    async deleteExpense(expenseId) {
        const response = await fetch(`${this.baseURL}/api/expenses/${expenseId}`, {
            method: 'DELETE',
            headers: this.getHeaders()
        });
        return this.handleResponse(response);
    }

    // Revenue methods
    async getRevenues() {
        const response = await fetch(`${this.baseURL}/api/revenues`, {
            headers: this.getHeaders()
        });
        return this.handleResponse(response);
    }

    async createRevenue(revenueData) {
        const response = await fetch(`${this.baseURL}/api/revenues`, {
            method: 'POST',
            headers: this.getHeaders(),
            body: JSON.stringify(revenueData)
        });
        return this.handleResponse(response);
    }

    async updateRevenue(revenueId, revenueData) {
        const response = await fetch(`${this.baseURL}/api/revenues/${revenueId}`, {
            method: 'PUT',
            headers: this.getHeaders(),
            body: JSON.stringify(revenueData)
        });
        return this.handleResponse(response);
    }

    async deleteRevenue(revenueId) {
        const response = await fetch(`${this.baseURL}/api/revenues/${revenueId}`, {
            method: 'DELETE',
            headers: this.getHeaders()
        });
        return this.handleResponse(response);
    }

    // Livestock methods
    async getLivestock() {
        const response = await fetch(`${this.baseURL}/api/livestock`, {
            headers: this.getHeaders()
        });
        return this.handleResponse(response);
    }

    async createLivestock(livestockData) {
        const response = await fetch(`${this.baseURL}/api/livestock`, {
            method: 'POST',
            headers: this.getHeaders(),
            body: JSON.stringify(livestockData)
        });
        return this.handleResponse(response);
    }

    // Budget methods
    async getBudget() {
        const response = await fetch(`${this.baseURL}/api/budget`, {
            headers: this.getHeaders()
        });
        return this.handleResponse(response);
    }

    async createBudget(budgetData) {
        const response = await fetch(`${this.baseURL}/api/budget`, {
            method: 'POST',
            headers: this.getHeaders(),
            body: JSON.stringify(budgetData)
        });
        return this.handleResponse(response);
    }

    // Analytics methods
    async getAnalyticsSummary() {
        const response = await fetch(`${this.baseURL}/api/analytics/summary`, {
            headers: this.getHeaders()
        });
        return this.handleResponse(response);
    }

    // ML Prediction methods
    async predictExpenses(predictionData) {
        const response = await fetch(`${this.baseURL}/api/predict`, {
            method: 'POST',
            headers: this.getHeaders(),
            body: JSON.stringify(predictionData)
        });
        return this.handleResponse(response);
    }

    // Utility methods
    getHeaders() {
        const headers = {
            'Content-Type': 'application/json',
        };
        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }
        return headers;
    }

    async handleResponse(response) {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || `HTTP ${response.status}`);
            }
            return data;
        } else {
            const text = await response.text();
            if (!response.ok) {
                throw new Error(text || `HTTP ${response.status}`);
            }
            return { success: true, data: text };
        }
    }

    // Health check
    async healthCheck() {
        try {
            const response = await fetch(`${this.baseURL}/api/health`);
            return await this.handleResponse(response);
        } catch (error) {
            return {
                success: false,
                error: error.message,
                status: 'API server not reachable'
            };
        }
    }
}

// Global API client instance
const farmAPI = new FarmAPIClient();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { FarmAPIClient, farmAPI };
}
