package com.dashboard.dashboard.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.oauth2.client.oidc.userinfo.OidcUserService;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtDecoders;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;

import com.dashboard.dashboard.entities.UserEntity;
import com.dashboard.dashboard.repositories.UserRepository;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

	@Bean
	public SecurityFilterChain securityFilterChain(HttpSecurity http, UserRepository userRepository) throws Exception {
		http
			.cors(Customizer.withDefaults())
			.csrf(c -> c.disable())
			.authorizeHttpRequests(authorize -> authorize
				.anyRequest()
				.permitAll()
				// .authenticated()
			)
			.oauth2Login(oauth2 -> oauth2
						.successHandler(new SimpleUrlAuthenticationSuccessHandler("http://localhost:4200"))
						.userInfoEndpoint(userInfo -> userInfo
						.oidcUserService(oidcUserRequest -> {
							OidcUser oidcUser = new OidcUserService().loadUser(oidcUserRequest);

							String externalId = oidcUser.getSubject();
							String username = oidcUser.getPreferredUsername();
							String email = oidcUser.getEmail();

							userRepository.findByExternalId(externalId)
								.orElseGet(() -> {
									UserEntity newUser = new UserEntity();
									newUser.setExternalId(externalId);
									newUser.setUsername(username);
									newUser.setEmail(email);
									return userRepository.save(newUser);
								});

							return oidcUser;
						})
					)
			)  // enables redirect to Authentik
			.oauth2ResourceServer(oauth2 -> oauth2.jwt(Customizer.withDefaults())); 
		return http.build();
	}


	@Bean
	public JwtDecoder jwtDecoder() {
		return JwtDecoders.fromIssuerLocation("http://localhost:9000/application/o/dashboard/");
	}

}
