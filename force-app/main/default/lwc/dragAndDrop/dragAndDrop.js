import { LightningElement } from 'lwc';

export default class DragAndDrop extends LightningElement {
    options = [
        {
            id: 1,
            title: 'John',
            subtitle: 'Alabama',
            sequence: 1
        },
        {
            id: 2,
            title: 'Emily',
            subtitle: 'Alaska',
            sequence: 2
        },
        {
            id: 3,
            title: 'Michael',
            subtitle: 'Arizona',
            sequence: 3
        },
        {
            id: 5,
            title: 'Jessica',
            subtitle: 'Arkansas',
            sequence: 5
        },
        {
            id: 4,
            title: 'Daniel',
            subtitle: 'California',
            sequence: 4
        }
    ];
    dragSource;
    dropDestination;

    get optsize() {
        return this.options.length;
    }

    connectedCallback() {
        //Randomize List
        this.randomizeOSequence();

        this.sortOptions();
    }

    randomizeOSequence() {
        // Randomize the sequence number for each item
        let oldOptions = this.options;
        oldOptions.forEach((element) => {
            element.sequence = Math.floor(Math.random() * 100);
        });
        this.options = [...oldOptions];

        //Print the sequence number of each item in the console
        this.options.forEach((element) => {
            console.log(
                'Title: ' + element.title + ' Sequence: ' + element.sequence
            );
        });

        console.log(
            '----------------- Initial Randomization -----------------'
        );
    }

    handleDragStart(event) {
        this.dragSource = JSON.parse(JSON.stringify(event.detail));
    }

    handleDrop(event) {
        this.dropDestination = JSON.parse(JSON.stringify(event.detail));
        this.reorder();

        //Print the sequence number of each item in the console
        this.options.forEach((element) => {
            console.log(
                'Title: ' + element.title + ' Sequence: ' + element.sequence
            );
        });

        console.log('-----------------');
    }

    sortOptions() {
        // Sort the options based on sequence number
        this.options.sort(function (a, b) {
            return a.sequence - b.sequence;
        });
    }

    resetSequence() {
        // Reset the sequence number for each item starting from 1
        let seq = 1;
        let oldOptions = this.options;
        oldOptions.forEach((element) => {
            element.sequence = seq++;
        });
        this.options = [...oldOptions];
    }

    reorder() {
        let oldOptions = [...this.options];
        let draggedIndex = oldOptions.findIndex(
            (opt) => opt.id === this.dragSource.id
        );
        let dropIndex = oldOptions.findIndex(
            (opt) => opt.id === this.dropDestination.id
        );

        if (draggedIndex === dropIndex) return; // No movement needed

        let draggedItem = oldOptions.splice(draggedIndex, 1)[0]; // Remove the dragged item
        oldOptions.splice(dropIndex, 0, draggedItem); // Insert at the new position

        // Reassign sequence numbers based on new order
        oldOptions.forEach((item, index) => {
            item.sequence = index + 1;
        });

        this.options = [...oldOptions];
    }

    handleRemoveItem(event) {
        // Remove an item from the list based on the id of the item clicked
        let removeId = event.detail;
        let index = this.options.findIndex((option) => option.id === removeId);
        let oldOptions = this.options;
        oldOptions.splice(index, 1);
        this.options = [...oldOptions];
        this.resetSequence();
    }
}
