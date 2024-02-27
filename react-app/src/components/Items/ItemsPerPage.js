function ItemsPerPage({ itemsPerPage, setItemsPerPage}) {

    return (
        <div className="items_per_page">
          <label>Show per page: </label>
          <select
            className="select_items_per_page"
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(e.target.value);
            }}
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="30">30</option>
          </select>
        </div>
    );
}

export default ItemsPerPage;
