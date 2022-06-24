export function sortData(listData, sortBy) {
    switch (sortBy) {
      case "title": {
        return [...listData].sort((a, b) =>
          a.title < b.title ? -1 : a.title > b.title ? 1 : 0
        );
      }
      case "dateExpiry_up": {
        return [...listData].sort(
          (a, b) => new Date(b.dateExpiry) - new Date(a.dateExpiry)
        );
      }
      case "dateExpiry_down": {
        return [...listData].sort(
          (a, b) => new Date(a.dateExpiry) - new Date(b.dateExpiry)
        );
      }
      case "dateCreated_up": {
        return [...listData].sort(
          (a, b) => new Date(b.dateCreated) - new Date(a.dateCreated)
        );
      }
      case "dateCreated_down": {
        return [...listData].sort(
          (a, b) => new Date(a.dateCreated) - new Date(b.dateCreated)
        );
      }
      case "deletionDate": {
        return [...listData].sort(
          (a, b) => new Date(b.deletionDate) - new Date(a.deletionDate)
        );
      }
      default:
        return listData;
    }
  }