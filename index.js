const db = {
    methods: {
      find: (id) => {
        return db.items.find((item) => item.id === id);
      },
      remove: (items) => {
        items.forEach((item) => {
          const product = db.methods.find(item.id);
          product.cantidad = product.cantidad - item.cantidad;
        });
  
        console.log(db);
      },
    },
    items: [
      {
        id: 0,
        nombre: "Pain au chocolat",
        precio: 300,
        cantidad: 25,
      },
      {
        id: 1,
        nombre: "Cinnamon rolls",
        precio: 340,
        cantidad: 50,
      },
      {
        id: 2,
        nombre: "Croissant",
        precio: 350,
        cantidad: 180,
      },
    ],
  };
  
  const shoppingCart = {
    items: [],
    methods: {
      add: (id, cantidad) => {
        const cartItem = shoppingCart.methods.get(id);
        if (cartItem) {
          if (shoppingCart.methods.hasInventory(id, cantidad + cartItem.cantidad)) {
            cartItem.cantidad++;
          } else {
            alert("No hay más inventario");
          }
        } else {
          shoppingCart.items.push({ id, cantidad });
        }
      },
      remove: (id, cantidad) => {
        const cartItem = shoppingCart.methods.get(id);
  
        if (cartItem.cantidad - 1 > 0) {
          cartItem.cantidad--;
        } else {
          shoppingCart.items = shoppingCart.items.filter(
            (item) => item.id !== id
          );
        }
      },
      count: () => {
        return shoppingCart.items.reduce((acc, item) => acc + item.cantidad, 0);
      },
      get: (id) => {
        const index = shoppingCart.items.findIndex((item) => item.id === id);
        return index >= 0 ? shoppingCart.items[index] : null;
      },
      getTotal: () => {
        let total = 0;
        shoppingCart.items.forEach((item) => {
          const found = db.methods.find(item.id);
          total += found.precio * item.cantidad;
        });
        return total;
      },
      hasInventory: (id, cantidad) => {
        return db.items.find((item) => item.id === id).cantidad - cantidad >= 0;
      },
      purchase: () => {
        db.methods.remove(shoppingCart.items);
      },
    },
  };
  
  renderStore();
  
  function renderStore() {
    const html = db.items.map((item) => {
      return `
          <div class="item">
              <div class="nombre">${item.nombre}</div>
              <div class="precio">${numberToCurrency(item.precio)}</div>
              <div class="cantidad">${item.cantidad} unidades </div>
              <div class="actions"><button class="add" data-id="${
                item.id
              }">Añadir al carrito</button></div>
          </div>`;
    });
  
    document.querySelector("#store-container").innerHTML = html.join("");
  
    document.querySelectorAll(".item .actions .add").forEach((button) => {
      button.addEventListener("click", (e) => {
        const id = parseInt(button.getAttribute("data-id"));
        const item = db.methods.find(id);
  
        if (item && item.cantidad - 1 > 0) {
          shoppingCart.methods.add(id, 1);
          console.log(db, shoppingCart);
          renderShoppingCart();
        } else {
          alert("No hay stock disponible del artículo");
        }
      });
    });
  }
  
  function renderShoppingCart() {
    const html = shoppingCart.items.map((item) => {
      const dbItem = db.methods.find(item.id);
      return `
              <div class="item">
                  <div class="nombre">${dbItem.nombre}</div>
                  <div class="precio">${numberToCurrency(dbItem.precio)}</div>
                  <div class="cantidad">${item.cantidad} unidades</div>
                  <div class="subtotal">Subtotal: ${numberToCurrency(
                    item.cantidad * dbItem.precio
                  )}</div>
                  <div class="actions">
                      <button class="addOne" data-id="${dbItem.id}">+</button>
                      <button class="removeOne" data-id="${dbItem.id}">-</button>
                  </div>
              </div>
          `;
    });
    const closeButton = `
    <div class="cart-header">
      <button id="bClose">Close</button>
    </div>`;
    const purchaseButton =
      shoppingCart.items.length > 0
        ? `<div class="cart-actions">
      <button id="bPurchase">Terminar compra</button>
    </div>`
        : "";
    const total = shoppingCart.methods.getTotal();
    const totalDiv = `<div class="total">Total: ${numberToCurrency(total)}</div>`;
    document.querySelector("#shopping-cart-container").innerHTML =
      closeButton + html.join("") + totalDiv + purchaseButton;
  
    document.querySelector("#shopping-cart-container").classList.remove("hide");
    document.querySelector("#shopping-cart-container").classList.add("show");
  
    document.querySelectorAll(".addOne").forEach((button) => {
      button.addEventListener("click", (e) => {
        const id = parseInt(button.getAttribute("data-id"));
        shoppingCart.methods.add(id, 1);
        renderShoppingCart();
      });
    });
  
    document.querySelectorAll(".removeOne").forEach((button) => {
      button.addEventListener("click", (e) => {
        const id = parseInt(button.getAttribute("data-id"));
        shoppingCart.methods.remove(id, 1);
        renderShoppingCart();
      });
    });
  
    document.querySelector("#bClose").addEventListener("click", (e) => {
      document.querySelector("#shopping-cart-container").classList.remove("show");
      document.querySelector("#shopping-cart-container").classList.add("hide");
    });
    const bPurchase = document.querySelector("#bPurchase");
    if (bPurchase) {
      bPurchase.addEventListener("click", (e) => {
        shoppingCart.methods.purchase();
      });
    }
  }
  
  function numberToCurrency(n) {
    return new Intl.NumberFormat("en-US", {
      maximumSignificantDigits: 2,
      style: "currency",
      currency: "USD",
    }).format(n);
  }