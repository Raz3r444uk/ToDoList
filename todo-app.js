(function () {
  function createAppTitlte(title) {
    let appTitle = document.createElement("h2");
    appTitle.style.marginTop = 20 + "px";
    appTitle.innerHTML = title;
    return appTitle;
  }

  function createTodoItemForm() {
    let form = document.createElement("form");
    let input = document.createElement("input");
    let buttonWrapper = document.createElement("div");
    let button = document.createElement("button");

    form.classList.add("input-group", "mb-3");
    input.classList.add("form-control");
    input.placeholder = "Введите название нового дела";
    buttonWrapper.classList.add("input-group-append");
    button.classList.add("btn", "btn-primary");
    button.textContent = "Добавить дело";
    buttonWrapper.append(button);
    button.disabled = true;
    form.append(input);
    form.append(buttonWrapper);

    return {
      form,
      input,
      button,
    };
  }

  function buttonDisabled() {
    document.querySelector(".btn").setAttribute("disabled", "true");
  }

  function buttonEnable() {
    document.querySelector(".btn").removeAttribute("disabled");
  }

  function createTodoList() {
    let list = document.createElement("ul");
    list.classList.add("list-group");
    return list;
  }

  function createTodoItem(name, done, id = null) {
    let item = document.createElement("li");
    let buttonGroup = document.createElement("div");
    let doneButton = document.createElement("button");
    let deleteButton = document.createElement("button");
    let randomId = (len) => Math.random().toString(32).substring(3, len);
    item.id = randomId(10);

    item.classList.add(
      "list-group-item",
      "d-flex",
      "justify-content-between",
      "align-items-center"
    );

    item.textContent = name;

    if (done === true) {
      item.classList.add("list-group-item-success");
    }
    buttonGroup.classList.add("btn-group", "btn-group-sm");
    doneButton.classList.add("btn", "btn-success");
    doneButton.textContent = "Готово";
    deleteButton.classList.add("btn", "btn-danger");
    deleteButton.textContent = "Удалить";

    buttonGroup.append(doneButton);
    buttonGroup.append(deleteButton);
    item.append(buttonGroup);

    return {
      item,
      doneButton,
      deleteButton,
    };
  }

  function createTodoApp(
    container,
    title = "Список дел",
    arr = [],
    key = "key"
  ) {
    let todoAppTitle = createAppTitlte(title);
    let todoItemForm = createTodoItemForm();
    let todoList = createTodoList();
    container.append(todoAppTitle);
    container.append(todoItemForm.form);
    container.append(todoList);

    let arrCase =
      key && localStorage.getItem(key)
        ? JSON.parse(localStorage.getItem(key))
        : arr;

    arrCase.forEach((el) => {
      let startCase = createTodoItem(el.name, el.done, el.id);
      todoList.append(startCase.item);

      startCase.doneButton.addEventListener("click", function () {
        startCase.item.classList.toggle("list-group-item-success");
        for (let itemCase of arrCase) {
          if (itemCase.id === el.id) {
            itemCase.done = !itemCase.done;
          }
        }
        localStorage.setItem(key, JSON.stringify(arrCase));
      });

      startCase.deleteButton.addEventListener("click", function () {
        if (confirm("Вы уверены?")) {
          for (let i = arrCase.length; i--; ) {
            if (arrCase[i].id === el.id) {
              arrCase.splice(i, 1);
            }
          }
          startCase.item.remove();
          localStorage.setItem(key, JSON.stringify(arrCase));
        }
      });
    });

    todoItemForm.form.addEventListener("submit", function (e) {
      buttonDisabled();
      e.preventDefault();
      if (!todoItemForm.input.value) {
        return;
      }

      let todoItem = createTodoItem(todoItemForm.input.value);

      todoItem.doneButton.addEventListener("click", function () {
        todoItem.item.classList.toggle("list-group-item-success");
        for (let addedCase of arrCase) {
          if (addedCase.id === todoItem.item.id) {
            addedCase.done = !addedCase.done;
            localStorage.setItem(key, JSON.stringify(arrCase));
          }
        }
        localStorage.setItem(key, JSON.stringify(arrCase));
      });

      todoItem.deleteButton.addEventListener("click", function () {
        if (confirm("Вы уверены?")) {
          for (let i = arrCase.length; i--; ) {
            if (arrCase[i].id === todoItem.item.id) {
              arrCase.splice(i, 1);
            }
          }
          localStorage.setItem(key, JSON.stringify(arrCase));
          todoItem.item.remove();
        }
      });
      todoList.append(todoItem.item);

      arrCase.push({
        name: todoItemForm.input.value,
        done: false,
        id: todoItem.item.id,
      });
      localStorage.setItem(key, JSON.stringify(arrCase));

      todoItemForm.input.value = "";
    });

    todoItemForm.form.addEventListener("input", function () {
      if (!todoItemForm.input.value) {
        buttonDisabled();
      } else {
        buttonEnable();
      }
    });
  }

  window.createTodoApp = createTodoApp;
})();
