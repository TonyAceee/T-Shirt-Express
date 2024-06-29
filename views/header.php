<header>
        <div class="navbar">



            <a href="/index.html" class="logo"><img src="img/logo.png" alt="Logo"></a>
            <ul>

                <li><a href="#help">Help</a></li>
                <li id="login-li">
                    <a href="#login" id="login-btn">Login</a>
                </li>
            </ul>
            <div id="modal" class="modal">
                <div class="modal-content">
                    <span class="close">&times;</span>
                    <div id="login-form" class="form-container active">
                        <h2>Login</h2>
                        <form id="login" action="/login" method="post">
                            <label for="login-username">Username:</label>
                            <input type="text" id="login-username" name="username" required>
                            <br>
                            <label for="login-password">Password:</label>
                            <input type="password" id="login-password" name="password" required>
                            <br>
                            <button type="submit">Submit</button>
                            <button type="button" id="show-register-btn">Register</button>
                        </form>
                    </div>
                    <div id="register-form" class="form-container">
                        <h2>Register</h2>
                        <form id="register" action="/register" method="post">
                            <label for="user-email">Email:</label>
                            <input type="text" id="user-email" name="email" required>
                            <label for="register-username">Username:</label>
                            <input type="text" id="register-username" name="username" required>
                            <br>
                            <label for="register-password">Password:</label>
                            <input type="password" id="register-password" name="password" required>
                            <br>
                            <button type="submit">Submit</button>
                            <button type="button" id="show-login-btn">Login</button>
                        </form>
                    </div>
                </div>
            </div>

        </div>
    </header>