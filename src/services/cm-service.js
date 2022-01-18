export default class CmService {

    getResource = async (url) => {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Could not fetch ${url}, received ${response.status}`)
        }
        return await response.json();
    };

    sendRequestWithBody = async (url, data, method) => {
        const response = await fetch(url, {
            method,
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

    changeInvitationStatus = async (invitationId, newStatus) => {
        return await this.getResource(`/invitation/change/${invitationId}/${newStatus}`);
    };

    getComments = async contractId => {
        const comments = await this.getResource(`/comments?contract_id=${contractId}`);
        return comments.map(this._transformComment)
    };

    getCompanies = async userId => {
        return await this.getResource(`/companies?user_id=${userId}`);
    };

    getContract = async (contractId, userId) => {
        const contract = await this.getResource(`/contract/${contractId}/${userId}`);
        return this._transformGetContract(contract)
    };

    getContracts = async (userId, page, perPage, fieldName, reverse) => {
        const url = `/contracts/${userId}?page=${page}&per_page=${perPage}&field=${fieldName || 'undefined'}` +
        `&reverse=${reverse}`;
        const { currentPage, pagesCount, records } = await this.getResource(url);
        return {currentPage, pagesCount, contracts: records.map(this._transformContract)}
    };

    getContractVersions = async (contractId, userId) => {
        const versions = await this.getResource(`/contract/versions/${contractId}/${userId}`);
        return versions.map(this._transformVersion)
    };

    getDialog = async (dialogId, userId) => {
        const dialog = await this.getResource(`/dialog/${dialogId}/${userId}`);
        return await this._transformGetDialog(dialog)
    };

    getDialogs = async (contractId, userId, page, perPage, fieldName, reverse) => {
        const url = `/dialogs/${userId}?contract_id=${contractId}&page=${page}&per_page=${perPage}` +
            `&field=${fieldName || 'undefined'}&reverse=${reverse}`;
        const { currentPage, pagesCount, records } = await this.getResource(url);
        return {currentPage, pagesCount, dialogs: records.map(this._transformDialog)}
    };

    getDialogVariants = async (contractId, userId) => {
        return await this.getResource(`/dialog/variants/${contractId}/${userId}`);
    };

    getEmployeesRoles = async userId => {
        return await this.getResource(`/employees/roles/${userId}`);
    };

    getInvitations = async (contractId, userId, page, perPage, fieldName, reverse) => {
        const url = `/invitations/${userId}?contract_id=${contractId}&page=${page}&per_page=${perPage}` +
            `&field=${fieldName || 'undefined'}&reverse=${reverse}`;
        const { currentPage, pagesCount, records } = await this.getResource(url);
        return {currentPage, pagesCount, invitations: records.map(this._transformInvitation)}
    };

    getInvitationVariants = async (contractId, userId) => {
        return await this.getResource(`/invitation/variants/${contractId}/${userId}`);
    };

    getNotifications = async (contractId, userId, page, perPage, fieldName, reverse) => {
        const url = `/notifications/${userId}?contract_id=${contractId}&page=${page}&per_page=${perPage}` +
        `&field=${fieldName || 'undefined'}&reverse=${reverse}`;
        const { currentPage, pagesCount, records } = await this.getResource(url);
        return {currentPage, pagesCount, notifications: records.map(this._transformNotification)}
    };

    getUser = async userName => {
        return await this.getResource(`/user?name=${userName}`);
    };

    makeNotificationRead = async notificationId => {
        return await this.getResource(`/notification/read/${notificationId}`);
    };

    saveContractVersion = async (contractId, userId) => {
        return await this.getResource(`/contract/version/save/${contractId}/${userId}`);
    };

    updateContractStatus = async (contractId, userId, actionOnStatus) => {
        return await this.getResource(`/contract/status/update/${contractId}/${userId}?action=${actionOnStatus}`);
    };

    checkNewItems = async userId => {
        return await this.getResource(`/items/check/${userId}`);
    };

    createComment = async comment => {
        return await this.sendRequestWithBody('/comment/create', comment, 'Post');
    };

    createContract = async contract => {
        return await this.sendRequestWithBody('/contract/create', contract, 'Post');
    };

    createDialog = async dialogEntities => {
        return await this.sendRequestWithBody('/dialog/create', dialogEntities, 'Post');
    };

    createInvitations = async invitationEntities => {
        return await this.sendRequestWithBody('/invitations/create', invitationEntities, 'Post');
    };

    createMessage = async messageEntities => {
        return await this.sendRequestWithBody('/message/create', messageEntities, 'Post');
    };

    updateComment = async comment => {
        return await this.sendRequestWithBody('/comment/update', comment, 'Put');
    };

    updateContract = async contract => {
        return await this.sendRequestWithBody('/contract/update', contract, 'Put');
    };

    updateEmployeesRoles = async employeesInfo => {
        return await this.sendRequestWithBody('/employees/roles/update', employeesInfo, 'Put');
    };

    deleteComment = async commentInfo => {
        return await this.sendRequestWithBody('/comment/delete', commentInfo, 'DELETE');
    };

    deleteContract = async contractId => {
        return await this.delRequest('/contract/delete', contractId);
    };

    deleteContractVersion = async versionId => {
        return await this.delRequest('/contract/version/delete', versionId);
    };

    _transformContract = contract => {
        const { _id, text, companies, creation_date, status: { name: status }  } = contract;
        return {
            id: _id,
            text,
            companies: companies.map(company => company.name),
            creationDate: creation_date,
            status
        }
    };

    _transformDialog = dialog => {
        const { contract_id, dialog_id, sender, is_read, text, creation_date, participants } = dialog;
        return {
            contractId : contract_id,
            dialogId: dialog_id,
            sender,
            creationDate: creation_date,
            isRead: is_read,
            text,
            participants
        }
    };

    _transformGetContract = contract => {
        const { companiesAcceptances, actionOnStatus } = contract;
        contract = this._transformContract(contract);
        return {...contract, companiesAcceptances, actionOnStatus}
    };

    _transformGetDialog = dialog => {
        let { messages, contractId, participants } = dialog;
        messages = messages.map(this._transformMessage);
        return {
            messages,
            contractId,
            participants
        }
    };

    _transformComment = comment => {
        const { number, related_comments } = comment;
        const relatedComments = related_comments.map(related_comment => {
            const { id, author, text, creation_date } = related_comment
            return {id, author, text, creationDate: creation_date}
        })
        return {
            number,
            relatedComments,
            selected: false
        }
    }

    _transformInvitation = invitation => {
        const {
            _id, contract_id, creation_date, type, status, actions, userIsCreator,
            creator: {name: creatorName, company_name: creatorCompany},
            recipient: {name: recipientName, company_name: recipientCompany}
        } = invitation;
        return {
            id: _id,
            contractId: contract_id,
            creationDate: creation_date,
            creatorName,
            creatorCompany,
            recipientName,
            recipientCompany,
            purpose: type,
            status,
            actions,
            userIsCreator
        }
    };

    _transformMessage = message => {
        const { dialog_id, sender, is_read, text, creation_date } = message;
        return {
            dialogId: dialog_id,
            sender,
            isRead: is_read,
            text,
            creationDate: creation_date,
        }
    };

    _transformNotification = notification => {
        const { _id, contract_id, creation_date, is_read, text } = notification;
        return {id: _id, contractId: contract_id, creationDate: creation_date, isRead: is_read, text}
    };

    _transformVersion = version => {
        const { _id, creation_date, contract_status, text } = version;
        return {id: _id, creationDate: creation_date, status: contract_status, text}
    };
}
