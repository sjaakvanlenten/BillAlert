import moment from 'moment';
import Colors from '../constants/Colors';

export const setItemInfo = (item) => {
    const daysDifference = moment(item.dateExpiry).startOf('day').diff(moment().startOf('day'), 'days')

    const itemInfo = { //Normal Bill
        cardColor: Colors.primary,
        statusIcon: null, 
        statusText: 'Open',
        textColor: '#000000',
        headerText : `Nog ${daysDifference} dagen`,
    }
    if(item.deletionDate !== null){
        itemInfo.cardColor = '#464646'
        itemInfo.statusIcon = null    
        itemInfo.statusText = ''
        itemInfo.headerText = ''
    }
    if(item.paymentDate !== null && item.deletionDate === null ) { //Payed Bill
        itemInfo.cardColor = Colors.billPayed
        itemInfo.statusIcon = "check-circle"     
        itemInfo.statusText = 'Betaald'
        itemInfo.headerText = 'Betaald'
    }
    if(item.deletionDate === null && item.paymentDate === null) {
        if(daysDifference <= 0) { //Bill Overdue
            itemInfo.cardColor = Colors.billOverdue
            itemInfo.statusIcon = "alarm-light"    
            itemInfo.statusText = 'Te laat'
            itemInfo.textColor = Colors.billOverdue,
            itemInfo.headerText = `${(daysDifference*-1)+1} ${daysDifference == 0 ? 'dag' : 'dagen'} te laat!`
        } 
        else if(daysDifference <= 7) { //Urgent Bill
            itemInfo.cardColor = Colors.billUrgent
            itemInfo.statusIcon = "alert"     
            itemInfo.statusText = 'Urgent' 
            if(daysDifference == 1) itemInfo.headerText= 'Laatste dag!'
        }
    }
    return itemInfo
}