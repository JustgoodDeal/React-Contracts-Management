export default class CmService {

    getResource = async (url) => {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Could not fetch ${url}, received ${response.status}`)
        }
        return await response.json();
    };

    postRequest = async (url, data) => {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data)
        });
        if (!response.ok) {
            throw new Error(`Could not fetch ${url}, received ${response.status}`)
        }
        return await response.json();
    };

    delRequest = async (url, id) => {
        const response = await fetch(`${url}/${id}`, {
            method: "DELETE",
        });
        if (!response.ok) {
            throw new Error(`Could not fetch ${url}, received ${response.status}`)
        }
        return await response.json();
    };

    getCompanies = async (userId) => {
        return await this.getResource(`/companies?user_id=${userId}`);
    };

    getContract = async (contractId, userId) => {
        const response = await this.getResource(`/contract/${contractId}/${userId}`);
        return this._transformGetContract(response)
    };

    getContracts = async (userId) => {
        const contracts = await this.getResource(`/contracts?user_id=${userId}`);
        return contracts.map(this._transformContract)
    };

    getUser = async (userName) => {
        return await this.getResource(`/user?name=${userName}`);
    };

    updateContractStatus = async (contractId, userId, actionOnStatus) => {
        return await this.getResource(`/contract/update/${contractId}/${userId}?action=${actionOnStatus}`);
    };

    createContract = async (contract) => {
        return await this.postRequest('/contract/create', contract);
    };

    deleteContract = async (id) => {
        return await this.delRequest('/contract/delete', id);
    };

    _transformContract = (contract) => {
        return {
            id: contract._id,
            text: contract.text,
            companies: contract.companies.map(company => company.name),
            creationDate: contract.creation_date,
            status: contract.status.name
        }
    };

    _transformGetContract = (response) => {
        return {
            contract: this._transformContract(response.contract),
            companiesAcceptances: response.companies_acceptances,
            actionOnStatus: response.action_on_status
        }
    };
}
