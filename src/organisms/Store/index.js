import React, { createContext } from "react";

const StoreContext = createContext();

/*  Storage concept
*
* Storing ActionsIDs and ActionsData in 
* separated localStorage items. 
*
* ActionsIDs would look like this:
* ex. ['23dsfe3234','46234wrwds','124dfw4234']
*
* ActionsData would look like nowadays actions 
* item but in form of a object:
* ex. {'23dsfe3234': {name: "abc", attackers...}, '46234wrwds':...}
* 
* Action search would look like this:
* /akcja/:id => id => ActionsData[ActionsIDs[id]]
*
*/

class StoreProvider extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            actions: JSON.parse(localStorage.getItem('actions')) || [],
            messages: JSON.parse(localStorage.getItem('messages')) || []
        }; 
    }

    loadStateFromLocalStorage = () => {
        this.setState((prevState, props) => ({
            actions: JSON.parse(localStorage.getItem('actions')) || prevState.actions,
            messages: JSON.parse(localStorage.getItem('messages')) || prevState.messages,
        }));
    }

    saveStateToLocalStorage = () => {
        localStorage.setItem('actions', JSON.stringify(this.state.actions));
        localStorage.setItem('messages', JSON.stringify(this.state.messages));
    }

    clearAll = () => {
        this.clearActions();
        this.clearMessages();
    }

    clearActions = () => this.setState({actions: []});
    clearMessages = () => this.setState({messages: []});

    getActions = () => this.state.actions;
    getAction = id => this.state.actions[id];
    addAction = data => {
        this.setState((prevState, props)=>{
            prevState.actions.push(data);
            return {actions: prevState.actions}
        });
        return this.state.actions.length; 
    }
    editAction = (id, data) => {
        this.setState((prevState, props)=>{
            prevState.actions[id] = data;
            return {actions: prevState.actions}
        });
    }
    removeAction = id => {
        this.setState((prevState, props)=>{
            prevState.actions.splice(id,1);
            return {actions: prevState.actions}
        });
    }

    getMessages = () => this.state.messages;
    getMessages = id => this.state.messages[id];
    // addMessages = data => {
    //     this.setState((prevState, props)=>{
    //         prevState.messages.push(data);
    //         return {
    //             messages: prevState.messages
    //         }
    //     });
    //     return this.state.messages.length; 
    // }

    render() {
        this.saveStateToLocalStorage();

        return (
            <StoreContext.Provider value={{store: this, ...this.state}}>
                {this.props.children}
            </StoreContext.Provider>
        )
    }
}

const StoreConsumer = StoreContext.Consumer;

export {StoreProvider, StoreConsumer, StoreContext} 