package com.dashboard.dashboard.config;


@Bean
public OAuth2UserService<OidcUserRequest, OidcUser> oidcUserService(UserRepository userRepository) {
    return userRequest -> {
        OidcUser oidcUser = new OidcUserService().loadUser(userRequest);

        String externalId = oidcUser.getSubject(); // OIDC user ID
        String username = oidcUser.getPreferredUsername();
        String email = oidcUser.getEmail();

        User user = userRepository.findByExternalId(externalId)
            .orElseGet(() -> {
                User newUser = new User();
                newUser.setExternalId(externalId);
                newUser.setUsername(username);
                newUser.setEmail(email);
                return userRepository.save(newUser);
            });

        // Optionally, sync further properties here

        return oidcUser;
    };
}
