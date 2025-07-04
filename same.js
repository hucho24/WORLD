
    let sellers = JSON.parse(localStorage.getItem("wadunia_data") || "{}");
    let store = JSON.parse(localStorage.getItem("wadunia_store") || "[]");

    const sellerInput = document.getElementById("sellerName");
    const itemInput = document.getElementById("itemName");
    const qtyInput = document.getElementById("quantity");
    const priceInput = document.getElementById("price");
    const sellerLists = document.getElementById("sellerLists");
    const summaryBody = document.getElementById("summaryBody");
    const totalSpentDisplay = document.getElementById("totalSpent");
    const storeListDiv = document.getElementById("storeList");
    const storeSummaryBody = document.getElementById("storeSummaryBody");

    const defaultPrices = {
      plastic: 30,
      corton: 10,
      white: 20
    };

    itemInput.onchange = () => {
      const selected = itemInput.value;
      if (defaultPrices[selected]) {
        priceInput.value = defaultPrices[selected];
      }
    };

    function saveData() {
      localStorage.setItem("wadunia_data", JSON.stringify(sellers));
    }
    

    function saveStore() {
      localStorage.setItem("wadunia_store", JSON.stringify(store));
    }

    function addItem() {
      const seller = sellerInput.value.trim();
      const item = itemInput.value;
      const qty = parseInt(qtyInput.value);
      const price = parseFloat(priceInput.value);

      if (!seller || !item || isNaN(qty) || qty <= 0 || isNaN(price) || price < 0) {
        alert("Please enter valid data.");
        return;
      }

      if (!sellers[seller]) sellers[seller] = [];
      sellers[seller].push({ item, quantity: qty, price });
      saveData();
      render();
      itemInput.value == qtyInput.value == priceInput.value =="";
    }

    function render() {
      sellerLists.innerHTML = "";
      summaryBody.innerHTML = "";
      let summary = {}, totalSpent = 0;

      for (const seller in sellers) {
        const div = document.createElement("div");
        div.className = "seller";

        const header = document.createElement("div");
        header.className = "seller-header";
        const sellerTotal = sellers[seller].reduce((sum, e) => sum + e.quantity * e.price, 0);
        header.innerHTML = `<strong>${seller}</strong> - Total: Ksh ${sellerTotal.toFixed(2)}`;

        const btns = document.createElement("div");

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete Seller";
        deleteBtn.onclick = () => {
          if (confirm(`Delete seller "${seller}"?`)) {
            delete sellers[seller];
            saveData();
            render();
          }
        };

        btns.append(deleteBtn);
        header.appendChild(btns);
        div.appendChild(header);

        sellers[seller].forEach((entry, i) => {
          const itemDiv = document.createElement("div");
          itemDiv.className = "item";

          const name = document.createElement("span");
          name.textContent = entry.item;

          const qty = document.createElement("input");
          qty.type = "number";
          qty.value = entry.quantity;
          qty.min = 1;
          qty.onchange = () => {
            entry.quantity = parseInt(qty.value);
            saveData();
            render();
          };

          const price = document.createElement("input");
          price.type = "number";
          price.value = entry.price;
          price.step = "0.01";
          price.onchange = () => {
            entry.price = parseFloat(price.value);
            saveData();
            render();
          };

          const total = document.createElement("span");
          total.textContent = `Total: Ksh ${(entry.quantity * entry.price).toFixed(2)}`;

          const del = document.createElement("button");
          del.textContent = "Delete";
          del.onclick = () => {
            if (confirm(`Delete "${entry.item}" from ${seller}?`)) {
              sellers[seller].splice(i, 1);
              if (sellers[seller].length === 0) delete sellers[seller];
              saveData();
              render();
            }
          };

          itemDiv.append(name, qty, price, total, del);
          div.appendChild(itemDiv);

          const key = entry.item;
          if (!summary[key]) summary[key] = { quantity: 0, amount: 0 };
          summary[key].quantity += entry.quantity;
          summary[key].amount += entry.quantity * entry.price;
          totalSpent += entry.quantity * entry.price;
        });

        sellerLists.appendChild(div);
      }

      for (const item in summary) {
        const row = document.createElement("tr");
        row.innerHTML = `<td>${item}</td><td>${summary[item].quantity}</td><td>${summary[item].amount.toFixed(2)}</td>`;
        summaryBody.appendChild(row);
      }

      totalSpentDisplay.textContent = `All Total Amount Spent: Ksh ${totalSpent.toFixed(2)}`;
      renderStore();
    }

    function renderStore() {
      storeListDiv.innerHTML = "";
      storeSummaryBody.innerHTML = "";
      const storeItems = {};

      store.forEach((entry, idx) => {
        const div = document.createElement("div");
        div.className = "store-seller";

        const header = document.createElement("div");
        header.className = "store-header";
        header.innerHTML = `<strong>${entry.seller}</strong> - Ksh ${entry.total.toFixed(2)}<br><small>${entry.date}</small>`;

        const delBtn = document.createElement("button");
        delBtn.textContent = "Delete";
        delBtn.onclick = () => {
          if (confirm(`Delete stored record for "${entry.seller}"?`)) {
            store.splice(idx, 1);
            saveStore();
            render();
          }
        };
        header.appendChild(delBtn);
        div.appendChild(header);

        entry.list.forEach(i => {
          const row = document.createElement("div");
          row.className = "store-item";
          row.textContent = `${i.item} - Qty: ${i.quantity}, Price: ${i.price}`;
          div.appendChild(row);

          if (!storeItems[i.item]) storeItems[i.item] = 0;
          storeItems[i.item] += i.quantity;
        });

        storeListDiv.appendChild(div);
      });

      for (const item in storeItems) {
        const row = document.createElement("tr");
        row.innerHTML = `<td>${item}</td><td>${storeItems[item]}</td>`;
        storeSummaryBody.appendChild(row);
      }
    }

    document.getElementById("addBtn").onclick = addItem;

    document.getElementById("deleteAllBtn").onclick = () => {
      if (confirm("Delete all current sellers and items?")) {
        sellers = {};
        saveData();
        render();
      }
    };

    document.getElementById("sendAllToStoreBtn").onclick = () => {
      if (Object.keys(sellers).length === 0) {
        alert("No data to send.");
        return;
      }
      if (confirm("Send all current sellers and their lists to Store List?")) {
        for (const seller in sellers) {
          const list = sellers[seller];
          const total = list.reduce((sum, e) => sum + e.quantity * e.price, 0);
          const date = new Date().toLocaleString();
          store.push({ seller, list, total, date });
        }
        sellers = {};
        saveData();
        saveStore();
        render();
      }
    };

    document.getElementById("deleteAllStoreBtn").onclick = () => {
      if (confirm("Delete all records from the store?")) {
        store = [];
        saveStore();
        render();
      }
    };

    render();
    
